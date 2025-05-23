import axios from 'axios';
import fs from 'fs';
import path from 'path';
import db from '../../config/db.js';
import Cepp from '../../models/Cepp.js';
import ConfiguracaoIntegracao from '../../models/ConfiguracaoIntegracao.js';
import { logErro, logInfo } from '../logService.js';

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
  const ceppsAtualizar = new Set();
  const batchSize = 10;
  let urlExterna = "";
  let urlEndpoint = "";
  let sqlApontamento = "";
  let sqlApontamentoProd = "";
  let sqlApontamentoDet = "";
  let sqlApontamentoRetDet = "";
  let colunasApontamento = "";
  let colunasApontamentoProd = "";
  let colunasApontamentoDet = "";
  let colunasApontamentoRetDet = "";
  let url = "";

  sqlApontamento = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_columns.json'), 'utf-8'));
  sqlApontamentoProd = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_producao_columns.json'), 'utf-8'));
  sqlApontamentoDet = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_det_columns.json'), 'utf-8'));
  sqlApontamentoRetDet = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_ret_det_columns.json'), 'utf-8'));

  try {
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
    // const ceppsAtualizar = await Cepp.query()
    //   .where('CEPPSincronizado', false)
    //   .where('OrdemProducaoCodReferencial', '<>', '');

    const query = fs.readFileSync(getSqlFilePath('getCeppCicloProdutivo.sql'), 'utf8');

    // if (!validarComandoSql(query)) {
    //   const log = 'O arquivo getCeppCicloProdutivo.sql contém comandos proibidos (ex.: UPDATE, DELETE, DROP). Execução abortada.';
    //   sendLog('error', log);
    //   return { status: 'error', message: log };
    // }

    const resultado = await db.raw(query);

    urlEndpoint = '/ordem_producao';
    
    sendLog('info', 'Buscando dados de apontamento e apontamento_det para os ciclos produtivos.')
    const cicloProdutivo = await Promise.all(resultado[0].map(async (cepp) => {
      try {
        if (cepp.loteproducao_ciclopcp === 0 || cepp.loteproducao_ciclopcp === undefined) {
          url = `${urlExterna}${urlEndpoint}/${cepp.ordemproducao_ciclopcp}`;
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
        }
        if (cepp.responsavel_ciclopcp === 0 || cepp.responsavel_ciclopcp === "0" || cepp.responsavel_ciclopcp === undefined || cepp.responsavel_ciclopcp === 999997) {
          try {
            url = "";
            urlEndpoint = '/pcp_posto_de_trabalho'
            url = `${urlExterna}${urlEndpoint}/${cepp.postodetrabalho_ciclopcp}`;
            const { data: equip } = await axios.get(url,{
              headers: {
                'X_API_KEY': api_key
              }
            });

            if (!equip) { 
              sendLog('error', `Erro na busca do equipamento '${cepp.postodetrabalho_ciclopcp}'`)
              return { status: 'error', message: `Erro na busca do equipamento '${cepp.postodetrabalho_ciclopcp}'` };
            }
            cepp.responsavel_ciclopcp = equip.responsavel_postotrab ? equip.responsavel_postotrab : 999999;

          } catch (error) {
            sendLog('error', `Erro na busca do equipamento '${cepp.postodetrabalho_ciclopcp}'`)
          }
        }
      
        colunasApontamentoProd = sqlApontamentoProd.columns.map(col => {
          const columnContent = col.column;
          // if (!validarComandoSql(columnContent)) {
          //   const log = `Comando proibido encontrado na coluna '${columnContent}' de sqlApontamentoProd. Execução abortada.`;
          //   sendLog('error', log);
          //   throw new Error(log); // Lança erro pra parar o Promise.all
          // }
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        colunasApontamento = sqlApontamento.columns.map(col => {
          const columnContent = col.column;
          // if (!validarComandoSql(columnContent)) {
          //   const log = `Comando proibido encontrado na coluna '${columnContent}' de sqlApontamento. Execução abortada.`;
          //   sendLog('error', log);
          //   throw new Error(log); // Lança erro pra parar o Promise.all
          // }
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        sendLog('info', 'Buscando dados de apontamentos produtivos/retrabalho.')

        const apontamentos = await db('cepp as c')
          .select([
            ...colunasApontamentoProd.filter(col => col !== "responsavel_apont"),
            db.raw('? as "responsavel_apont"', [cepp.responsavel_ciclopcp])
          ])
          .innerJoin('ordemproducao as o', 'o.OrdemProducaoId', 'c.OrdemProducaoId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['P'])
          .andWhere('o.LoteProducaoId', cepp.ordemproducao_ciclopcp)
          .andWhere('c.OperacoesCEPPId', cepp.setor_ciclopcp)
          .andWhere('c.EquipamentoId', cepp.postodetrabalho_ciclopcp)
          .andWhere('c.CEPPDtInicio', '>=', cepp.dtexecucao_ciclopcp)
          .andWhere('c.CEPPDtInicio', '<=', cepp.dttermino_ciclopcp)
          .groupBy('c.CEPPId')
          .orderBy('e.SetorId')
          .orderBy('c.CEPPDtInicio');

        sendLog('info', 'Buscando dados de apontamentos de parada')

        const apontamentosParada = await db('cepp as c')
          .select([
            ...colunasApontamento.filter(col => col !== "responsavel_apont"),
            db.raw('? as "responsavel_apont"', [cepp.responsavel_ciclopcp])
          ])
          .innerJoin('ordemproducao as o', 'o.OrdemProducaoId', 'c.OrdemProducaoId')
          .innerJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['A'])
          // .where('m.MotivoParadaDescricao', 'not like', '%REGULAGEM%')
          .where('m.MotivoParadaTpErpExterno', '<>', 'AJ')
          .andWhere('o.LoteProducaoId', cepp.ordemproducao_ciclopcp)
          .andWhere('c.EquipamentoId', cepp.postodetrabalho_ciclopcp)
          .andWhere('c.CEPPDtInicio', '>=', cepp.dtexecucao_ciclopcp)
          .andWhere('c.CEPPDtInicio', '<=', cepp.dttermino_ciclopcp)
          .groupBy('c.CEPPId')
          .orderBy('c.CEPPDtInicio');
        
        const apontamentosRegulagem = await db('cepp as c')
          .select([
            ...colunasApontamento.filter(col => col !== "responsavel_apont"),
            db.raw('? as "responsavel_apont"', [cepp.responsavel_ciclopcp])
          ])
          .innerJoin('ordemproducao as o', 'o.OrdemProducaoId', 'c.OrdemProducaoId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['A'])
          .where('m.MotivoParadaTpErpExterno', 'AJ')
          .andWhere('o.LoteProducaoId', cepp.ordemproducao_ciclopcp)
          .andWhere('c.EquipamentoId', cepp.postodetrabalho_ciclopcp)
          .andWhere('c.CEPPDtInicio', '>=', cepp.dtexecucao_ciclopcp)
          .andWhere('c.CEPPDtInicio', '<=', cepp.dttermino_ciclopcp)
          .groupBy('c.CEPPId')
          .orderBy('e.SetorId')
          .orderBy('c.CEPPDtInicio');

          const newApontamentos = [
          ...apontamentos.filter(ap => ap.cepp_id !== null && ap.cepp_id !== undefined),
          ...apontamentosParada.filter(ap => ap.cepp_id !== null && ap.cepp_id !== undefined),
          ...apontamentosRegulagem.filter(ap => ap.cepp_id !== null && ap.cepp_id !== undefined)
        ];

        sendLog('info', 'Buscando dados de apontamento_det.')
        
        if (newApontamentos.length > 0) {
          let apontamentoDetalhado;
          try {
            colunasApontamentoDet = sqlApontamentoDet.columns.map(col => {
              // const columnContent = col.column;
              // if (!validarComandoSql(columnContent)) {
              //   const log = `Comando proibido encontrado na coluna '${columnContent}' de sqlApontamentoDet. Execução abortada.`;
              //   sendLog('error', log);
              //   throw new Error(log); // Lança erro pra parar o Promise.all
              // }
              if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
                return db.raw(`${col.column} as ${col.alias}`);
              } else {
                return `${col.column} as ${col.alias}`;
              }
            });

            colunasApontamentoRetDet = sqlApontamentoRetDet.columns.map(col => {
              // const columnContent = col.column;
              // if (!validarComandoSql(columnContent)) {
              //   const log = `Comando proibido encontrado na coluna '${columnContent}' de sqlApontamentoRetDet. Execução abortada.`;
              //   sendLog('error', log);
              //   throw new Error(log); // Lança erro pra parar o Promise.all
              // }
              if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
                return db.raw(`${col.column} as ${col.alias}`);
              } else {
                return `${col.column} as ${col.alias}`;
              }
            });

            apontamentoDetalhado = await Promise.all(newApontamentos.map(async (apontamento) => {
              try {
                if (apontamento.processo_apont !== 0) {
                  const apontamentoDet = await db('cepp as c')
                    .select(colunasApontamentoDet)
                    .innerJoin('ordemproducao as o', 'o.OrdemProducaoId', 'c.OrdemProducaoId')
                    .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
                    .innerJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
                    .where('c.OrdemProducaoCodReferencial', '<>', '')
                    .whereIn('c.CEPPTipoCEPP', ['A'])
                    // .where('c.MotivoParadaTpErpExterno', '<>', 'AJ')
                    .andWhere('o.LoteProducaoId', cepp.ordemproducao_ciclopcp)
                    .where('c.OrdemProducaoId', apontamento.ordemproducao_id)
                    .where('c.EquipamentoId', apontamento.postodetrabalho_apont)
                    .where('c.CEPPId', apontamento.cepp_id)
                    .andWhere('c.CEPPDtInicio', '>=', cepp.dtexecucao_ciclopcp)
                    .andWhere('c.CEPPDtInicio', '<=', cepp.dttermino_ciclopcp)
                    .groupBy('c.CEPPId')
                    .orderBy('e.SetorId')
                    .orderBy('c.CEPPDtInicio');
                  
                  apontamento.pcp_apontamento_det = apontamentoDet || [];
                  apontamento.lote_apont = cepp.loteproducao_ciclopcp || 0;
                  return apontamento;
                } else {
                  const apontamentoRet = await db('cepp as c')
                      .select(colunasApontamentoRetDet)
                      .innerJoin('ordemproducao as o', 'o.OrdemProducaoId', 'c.OrdemProducaoId')
                      .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
                      .innerJoin('motivoretrabalho as m', 'm.MotivoRetrabalhoId', 'c.MotivoRetrabalhoId')
                      .where('c.OrdemProducaoCodReferencial', '<>', '')
                      .whereIn('c.CEPPTipoCEPP', [ 'R'])
                      .andWhere('o.LoteProducaoId', cepp.ordemproducao_ciclopcp)
                      .where('c.OrdemProducaoId', apontamento.ordemproducao_id)
                      .where('c.EquipamentoId', apontamento.postodetrabalho_apont)
                      .andWhere('c.CEPPDtInicio', '>=', cepp.dtexecucao_ciclopcp)
                      .andWhere('c.CEPPDtInicio', '<=', cepp.dttermino_ciclopcp)
                      .groupBy('c.CEPPId')
                      .orderBy('e.SetorId')
                      .orderBy('c.CEPPDtInicio');
                      
                  apontamento.pcp_apontamento_det = apontamentoRet || [];
                  apontamento.lote_apont = cepp.loteproducao_ciclopcp || 0;
                  return apontamento
                }
              } catch (error) {
                sendLog('error', `Erro na busca dos apontamentos_det. Error: ${error}`);
                return { status: 'error', message: `Erro na requisição. Error: ${error}` };
              }
            }));
          } catch (error) {
            return { status: 'error', message: `Erro na requisição. Error: ${error}` };
          }
          cepp.pcp_apontamento = apontamentoDetalhado || [];
        }

      } catch (error) {
        sendLog('error', `Erro na requisição. Error: ${error}`)
        throw { status: 'error', message: `Exceção na busca dos apontamentos do ciclo. Error: ${error.message}` };
      }
      return { pcp_ciclo_produtivo: { ...cepp } };
    }));

    // return {
    //   status: 'teste', message: `teste`, cicloProdutivo
    // }
    if (cicloProdutivo.length > 0) {
      const batches = [];

      for (let i = 0; i < cicloProdutivo.length; i += batchSize) {
        batches.push(cicloProdutivo.slice(i, i + batchSize));
      }
      url = "";
      urlEndpoint = "";
      urlEndpoint = '/pcp_ciclo_completo/'
      url = `${urlExterna}${urlEndpoint}`;
      for (const batch of batches) {
        try {
          const response = await axios.post(url, batch, {
            headers: {
              'X_API_KEY': api_key
            }
          });


          if (response.status !== 200) {
            sendLog('error', `Falha ao enviar batch: ${JSON.stringify(batch)}`)
            return { status: 'error', message: `Falha ao enviar batch: ${JSON.stringify(batch)}`}
          }

          batch.map((cepp) => {
            ceppsAtualizar.add(cepp.pcp_ciclo_produtivo.ceppid);

            cepp.pcp_ciclo_produtivo.pcp_apontamento.map((apontamento) => {
              ceppsAtualizar.add(apontamento.cepp_id);

              apontamento.pcp_apontamento_det.map((apontamentoDet) => {
                ceppsAtualizar.add(apontamentoDet.cepp_id)
              })
            })
          });


          const ceppsAtualizarArray = [...ceppsAtualizar]
      
          sendLog('info', `Atualizando cepps sincronizados.`);
          if (ceppsAtualizarArray.length > 0) {
            await Cepp.query()
              .whereIn('CEPPId', ceppsAtualizarArray)
              .patch({ CEPPSincronizado: true });

            sendLog('info', `CEPPs atualizados: ${JSON.stringify(ceppsAtualizarArray)}`);
          }

          ceppsAtualizar.clear()
          ceppsAtualizarArray.length = 0

        } catch (error) {
          sendLog('error', `Erro ao enviar batch: ${JSON.stringify(batch)} (message: ${error.message})`);
          continue
          // return { status: 'error', message: `Erro ao enviar batch: (message: ${error.message})` };
        }
      }

      sendLog('success', `Sincronização concluída com sucesso.`);
      return { status: 'success', message: 'Sincronização concluída com sucesso.' };
    } else {
      sendLog('info', `Todos os ciclos produtivos já se encontram sincronizados!`);
      return { status: 'info', message: `Todos os ciclos produtivos já se encontram sincronizados!` };
    }

  } catch (error) {
    // console.error(error);
    sendLog('error', `Erro geral na sincronização de ${syncName} (message: ${error.message})`);
    return { status: 'error', message: `Erro na sincronização de ${syncName}. Verifique os logs. Error: ${error.message}` };
  }
}

export { sincronizar };

