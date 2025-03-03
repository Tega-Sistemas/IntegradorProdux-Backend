import fs from 'fs';
import path from 'path';
import axios from 'axios';
import ConfiguracaoIntegracao from '../../models/ConfiguracaoIntegracao.js';
import Cepp from '../../models/Cepp.js';
import { logErro, logInfo, logSucesso } from '../logService.js';
import db from '../../config/db.js';

const getSqlFilePath = (relativePath) => {
  return path.join(process.cwd(),'src','sql', relativePath);
}

const getJsonColumnPath = (relativePath) => {
  return path.join(process.cwd(),'src','json', relativePath);
}

const api_key = process.env.API_KEY;

const sendLog = (tipo, message) => {
  switch (tipo) {
    case 'info':
      logInfo(`<p>${message}</p>`)
      break;
    case 'error':
      logErro(`<p>${message}</p>`)
      break;
    case 'success':
      logInfo(`<p>${message}</p>`)
      break;
    default:
      logInfo(`<p>${message}</p>`)
      break;
  }
}

async function sincronizar() {
  const syncName = 'CEPP - Ciclo Produtivo';
  const batchSize = 20;
  let urlExterna = "";
  let urlEndpoint = "";
  let sqlApontamento = "";
  let sqlApontamentoDet = "";
  let colunasApontamento = "";
  let colunasApontamentoDet = "";
  let ordemProducaoId = 0;

  sqlApontamento = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_columns.json'), 'utf-8'));
  sqlApontamentoDet = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_det_columns.json'), 'utf-8'));

  try {
    sendLog('info', 'Iniciando sincronização para o ERP.')
    sendLog('info', 'Buscando configuração de integração com ERP')
    const configuracao = await ConfiguracaoIntegracao.query().where('tipo_integracao', 2);

    if (configuracao.length > 0) {
      configuracao.forEach(item => {
          urlExterna = `${item.tipo_conexao}://${item.ip}:${item.porta}`;
      });
    } else {
        let log = `Não foi encontrada configuração na integração - ${syncName}`;
        sendLog('error', log)
        return { status: 'error', message: log };
    }

    if (!urlExterna) {
      let log = 'Ocorreu um erro ao montar a URL da API';
      sendLog('error', log)
      return { status: 'error', message: log };
    }

    sendLog('info', 'Buscando registros de ciclo produtivo a serem sincronizados.')
    const ceppsAtualizar = await Cepp.query()
      .where('CEPPSincronizado', false);

    const query = fs.readFileSync(getSqlFilePath('getCeppCicloProdutivo.sql'), 'utf8');

    const resultado = await db.raw(query);

    urlEndpoint = '/ordem_producao';
    
    sendLog('info', 'Buscando dados de apontamento e apontamento_det para os ciclos produtivos.')
    const cicloProdutivo = await Promise.all(resultado[0].map(async (cepp) => {
      try {
        const url = `${urlExterna}${urlEndpoint}/${cepp.ordemproducao_ciclopcp}`;
        const { data } = await axios.get(url,{
          headers: {
            'X_API_KEY': api_key
          }
        });

        if (!data) {
          sendLog('error', `Erro na busca do lote de produção para a ordem '${cepp.ordemproducao_ciclopcp}'`)
          return { status: 'error', message: `Erro na busca do lote de produção para a ordem '${cepp.ordemproducao_ciclopcp}'` };
        }
        cepp.loteproducao_ciclopcp = data.lote_op;

        colunasApontamento = sqlApontamento.columns.map(col => {
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        sendLog('info', 'Buscando dados de apontamentos produtivos/retrabalho.')
        ordemProducaoId = cepp.ordemproducao_ciclopcp;
        const apontamentos = await db('cepp as c')
          .select(colunasApontamento)
          .innerJoin('ordemproducao as o', 'o.LoteProducaoId', 'c.OrdemProducaoId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['P', 'R'])
          .andWhere('c.OrdemProducaoId', ordemProducaoId)
          .groupBy('c.OrdemProducaoId')
          .groupBy('c.stSetorId')
          .groupBy('o.ProdutoCodigo')
          .groupBy('o.RevestimentoId')
          .groupBy('c.EquipamentoId')
          .orderBy('e.SetorId')
          .orderBy('c.CEPPDtInicio');

          sendLog('info', 'Buscando dados de apontamentos de parada')
          const apontamentosParada = await db('cepp as c')
          .select(colunasApontamento)
          .innerJoin('ordemproducao as o', 'o.LoteProducaoId', 'c.OrdemProducaoId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['A'])
          .andWhere('c.OrdemProducaoId', ordemProducaoId)
          .groupBy('c.OrdemProducaoId')
          .groupBy('c.stSetorId')
          .groupBy('c.EquipamentoId')
          .orderBy('e.SetorId')
          .orderBy('c.CEPPDtInicio');

          colunasApontamentoDet = sqlApontamentoDet.columns.map(col => {
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        const newApontamentos = [...apontamentos, ...apontamentosParada];

        sendLog('info', 'Buscando dados de apontamento_det.')
        const apontamentoDetalhado = await Promise.all(newApontamentos.map(async (apontamento) => {
          try {
            const apontamentoDet = await db('cepp as c')
            .select(colunasApontamentoDet)
            .innerJoin('ordemproducao as o', 'o.LoteProducaoId', 'c.OrdemProducaoId')
            .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
            .innerJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
            .where('c.OrdemProducaoCodReferencial', '<>', '')
            .where(function() {
              switch (apontamento.processo_apont) {
                case 1:
                  this.where('c.CEPPTipoCEPP', 'R');
                  break;
                case 2:
                  this.where('c.CEPPTipoCEPP', 'A');
                  break;
                default:
                  this.where('c.CEPPTipoCEPP', 'A'); // Caso queira algum valor padrão
              }
            })
            .where('c.OrdemProducaoId', ordemProducaoId)
            .where('c.stSetorId', apontamento.setor_apont)
            .where('c.EquipamentoId', apontamento.postodetrabalho_apont)
            .groupBy('c.CEPPId')
            .orderBy('e.SetorId')
            .orderBy('c.CEPPDtInicio');
            // apontamento.pcp_apontamento_det = [];
            apontamento.pcp_apontamento_det = apontamentoDet || [];
            return apontamento;
          } catch (error) {
            sendLog('error', `Erro na busca dos apontamentos_det. Error: ${error}`)
            return { status: 'error', message: `Erro na requisição. Error: ${error}` };
          }
        }));
        
        cepp.pcp_apontamento = apontamentoDetalhado || [];

      } catch (error) {
        sendLog('error', `Erro na requisição. Error: ${error}`)
        return { status: 'error', message: `Exceção na busca dos apontamentos do ciclo. Error: ${error}` };
      }
      return { pcp_ciclo_produtivo: { ...cepp } };
    }));

    if (cicloProdutivo.length > 0) {
      const batches = [];

      for (let i = 0; i < cicloProdutivo.length; i += batchSize) {
        batches.push(cicloProdutivo.slice(i, i + batchSize));
      }

      urlEndpoint = '/pcp_ciclo_completo'
      const url = `${urlExterna}${urlEndpoint}`;
      for (const batch of batches) {
        try {
          const { data } = await axios.post(url, batch, {
            headers: {
              'X_API_KEY': api_key
            }
          });

          if (data.status !== 'success') {
            sendLog('error', `Falha ao enviar batch: ${JSON.stringify(batch)}`)
            return { status: 'error', message: `Falha ao enviar batch: ${JSON.stringify(batch)}`}
          }

        } catch (error) {
          
          sendLog('error', `Erro ao enviar batch: ${JSON.stringify(batch)} (message: ${error.message})`);
          return { status: 'error', message: `Erro ao enviar batch: (message: ${error.message})` };
        }
      }

      await Cepp.query()
        .whereIn('CEPPId', ceppsAtualizar.map(cepp => cepp.CEPPId))
        .patch({ CEPPSincronizado: true });

      sendLog('success', `Sincronização concluída com sucesso.`);
      return { status: 'success', message: 'Sincronização concluída com sucesso.' };
    } else {
      sendLog('info', `Todos os ciclos produtivos já se encontram sincronizados!`);
      return { status: 'info', message: `Todos os ciclos produtivos já se encontram sincronizados!` };
    }

  } catch (error) {
    // console.error(error);
    sendLog('error', `Erro geral na sincronização de ${syncName} (message: ${error.message})`);
    return { status: 'error', message: `Erro na sincronização de ${syncName}. Verifique os logs.` };
  }
}

export { sincronizar };