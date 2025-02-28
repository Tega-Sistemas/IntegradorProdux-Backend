import fs from 'fs';
import path from 'path';
import axios from 'axios';
import ConfiguracaoIntegracao from '../../models/ConfiguracaoIntegracao.js';
import Cepp from '../../models/Cepp.js';
import { logErro } from '../logService.js';
import db from '../../config/db.js';

const getSqlFilePath = (relativePath) => {
  return path.join(process.cwd(),'src','sql', relativePath);
}

const getJsonColumnPath = (relativePath) => {
  return path.join(process.cwd(),'src','json', relativePath);
}

const api_key = process.env.API_KEY;

async function sincronizar() {
  const syncName = 'CEPP - Ciclo Produtivo';
  const batchSize = 20;
  let urlExterna;
  let urlEndpoint;
  let sqlConfig;
  let columns;
  let ordemProducaoId;

  try {
    const configuracao = await ConfiguracaoIntegracao.query().where('tipo_integracao', 2);

    if (configuracao.length > 0) {
      configuracao.forEach(item => {
          urlExterna = `${item.tipo_conexao}://${item.ip}:${item.porta}`;
      });
    } else {
        let log = `Não foi encontrada configuração na integração - ${syncName}`;
        logErro(`<p>${log}</p>`);
        return { status: 'error', message: log };
    }

    if (!urlExterna) {
      let log = 'Ocorreu um erro ao montar a URL da API';
      logErro(`<p>${log}</p>`);
      return { status: 'error', message: log };
    }

    const totalRecords = await Cepp.query().count('CEPPId as total')
      .first()
      .where('CEPPSincronizado', 0);
    const totalCount = totalRecords?.total || 0;

    const totalBatches = Math.ceil(totalCount / batchSize);

    const query = fs.readFileSync(getSqlFilePath('getCeppCicloProdutivo.sql'), 'utf8');

    const resultado = await db.raw(query);

    urlEndpoint = '/ordem_producao';
    const cicloProdutivo = await Promise.all(resultado[0].map(async (cepp) => {
      try {
        const url = `${urlExterna}${urlEndpoint}/${cepp.ordemproducao_ciclopcp}`;
        const { data } = await axios.get(url,{
          headers: {
            'X_API_KEY': api_key
          }
        });

        if (!data) {
          logErro(`<p>Erro na requisição</p>`);
          return { status: 'error', message: 'Erro na requisição' };
        }

        cepp.loteproducao_ciclopcp = data.LOTE_OP;
        sqlConfig = "";
        sqlConfig = JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_columns.json'), 'utf-8'));
        columns = sqlConfig.columns.map(col => {
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        ordemProducaoId = cepp.ordemproducao_ciclopcp;
        const apontamentos = await db('cepp as c')
          .select(columns)
          .innerJoin('ordemproducao as o', 'o.LoteProducaoId', 'c.OrdemProducaoId')
          .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
          .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
          .where('c.OrdemProducaoCodReferencial', '<>', '')
          .whereIn('c.CEPPTipoCEPP', ['A', 'P', 'R'])
          .andWhere('c.OrdemProducaoId', ordemProducaoId)
          .groupBy('c.OrdemProducaoId')
          .groupBy('c.stSetorId')
          .groupBy('o.ProdutoCodigo')
          .groupBy('o.RevestimentoId')
          .groupBy('c.EquipamentoId')
          .orderBy('e.SetorId')
          .orderBy('c.CEPPDtInicio');

        sqlConfig = "";  
        sqlConfig = await JSON.parse(fs.readFileSync(getJsonColumnPath('pcp_apontamento_det_columns.json'), 'utf-8'));
        columns = sqlConfig.columns.map(col => {
          if (col.column.startsWith('CONCAT') || col.column.startsWith('time_format') || col.raw) {
            return db.raw(`${col.column} as ${col.alias}`);
          } else {
            return `${col.column} as ${col.alias}`;
          }
        });

        const apontamentoDetalhado = await Promise.all(apontamentos.map(async (apontamento) => {
          const apontamentoDet = await db('cepp as c')
            .select(columns)
            .innerJoin('ordemproducao as o', 'o.LoteProducaoId', 'c.OrdemProducaoId')
            .innerJoin('equipamento as e', 'e.EquipamentoId', 'c.EquipamentoId')
            .leftJoin('motivoparada as m', 'm.MotivoParadaId', 'c.MotivoParadaId')
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
            .where('c.CEPPId', apontamento.cepp_id)
            .where('c.OrdemProducaoId', ordemProducaoId)
            .where('c.stSetorId', apontamento.setor_apont)
            .where('o.ProdutoCodigo', apontamento.item_apont)
            .where('c.RevestimentoId', apontamento.cor_apont)
            .where('c.EquipamentoId', apontamento.postodetrabalho_apont)
            .groupBy('c.CEPPId')
            .orderBy('e.SetorId')
            .orderBy('c.CEPPDtInicio');
            apontamento.pcp_apontamento_det = [];
            apontamento.pcp_apontamento_det.push(apontamento);
            return apontamento;
        }));
        
        // console.log(apontamentos);
        // console.log(apontamentoDetalhado.flat());

        // apontamentos.pcp_apontamento_det = apontamentoDetalhado.flat() || [];

        cepp.pcp_apontamento = apontamentos || [];


      } catch (error) {
        console.error("Erro na requisição");
        console.error(error)
      }
      return cepp;

    }));

    // try {
      
    // } catch (error) {
      
    // }
  
    return cicloProdutivo;

  } catch (error) {
    console.error(error);
    logErro(`<p>Erro geral na sincronização de ${syncName} (message: ${error.message})</p>`);
        return { status: 'error', message: `Erro na sincronização de ${syncName}. Verifique os logs.` };
  }
}

export { sincronizar };