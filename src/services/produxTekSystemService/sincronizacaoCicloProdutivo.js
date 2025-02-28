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

const api_key = process.env.API_KEY;

async function sincronizar() {
  const syncName = 'CEPP - Ciclo Produtivo';
  const batchSize = 20;
  let urlExterna;
  let urlEndpoint;

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



      } catch (error) {
        console.error("Erro na requisição");
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