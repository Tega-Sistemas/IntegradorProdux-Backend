import axios from 'axios';
import ConfiguracaoIntegracao from '../../models/ConfiguracaoIntegracao.js';
import Peca from '../../models/Peca.js';
import { logErro } from '../logService.js';

async function sincronizar() {
    const syncName = 'peça';
    const batchSize = 20;
    var urlExterna;

    try {
        const configuracao = await ConfiguracaoIntegracao.query().where('tipo_integracao', 1);
        const token = process.env.PRODUX_TOKEN;

        if (configuracao.length > 0) {
            configuracao.forEach(item => {
                urlExterna = `${item.tipo_conexao}://${item.ip}:${item.porta}/${item.nome_aplicacao}/Api/IntegracaoProdux/pecas`;
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

        const totalRecords = await Peca.query().count('PecaCodigo as total').first();
        const totalCount = totalRecords?.total || 0;

        if (totalCount === 0) {
            let log = `Nenhum dado encontrado para sincronização - ${syncName}`;
            logErro(`<p>${log}</p>`);
            return { status: 'info', message: log };
        }

        const totalBatches = Math.ceil(totalCount / batchSize);

        for (let i = 0; i < totalBatches; i++) {
            const offset = i * batchSize;

            const batch = await Peca.query()
                .select('PecaCodigo', 'PecaDescricao', 'PecaPesoBruto', 'PecaPesoLiquido', 'PecaIntegracaoId')
                .withGraphFetched('Roteiro')
                .modifyGraph('Roteiro', (builder) => {
                    builder.select('roteiro.SetorId', 'roteiro.EquipamentoId', 'roteiro.OperacoesCEPPId', 'roteiro.MedidaPeca', 'roteiro.QtdeMinuto');
                })
                .limit(batchSize)
                .offset(offset);

            if (!batch.length) {
                logErro(`<p>Nenhum dado encontrado no lote ${i + 1} de ${totalBatches}</p>`);
                continue;
            }

            const data = { "Peca": batch };
            
            try {
                await axios.post(urlExterna, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });
            } catch (error) {
                if (error.response) {
                    const erroResponse = {
                        status: error.response.status,
                        data: error.response.data ? JSON.stringify(error.response.data, null, 2) : 'Sem dados',
                        headers: error.response.headers ? JSON.stringify(error.response.headers, null, 2) : 'Sem cabeçalhos'
                    };

                    let log = `<p>Erro ao processar os dados do lote ${i + 1} de ${totalBatches} - ${syncName}:</p>` +
                        `<p>Status: ${erroResponse.status}</p>` +
                        `<p>Data: ${erroResponse.data}</p>` +
                        `<p>Headers: ${erroResponse.headers}</p>`;

                    logErro(log);
                } else if (error.request) {
                    logErro(`<p>Erro na requisição do lote ${i + 1} de ${totalBatches} (sem resposta): request: ${error.request || 'Sem dados de requisição'}</p>`);
                } else {
                    logErro(`<p>Erro ao configurar a requisição do lote ${i + 1} de ${totalBatches} (message: ${error.message})</p>`);
                }

                return { status: 'error', message: `Erro na sincronização do lote ${i + 1} de ${totalBatches} - ${syncName}. Verifique os logs.` };
            }
        }

        return { status: 'success', message: `Sincronização de ${syncName} concluída em ${totalBatches} lotes` };
    } catch (error) {
        logErro(`<p>Erro geral na sincronização de ${syncName} (message: ${error.message})</p>`);
        return { status: 'error', message: `Erro na sincronização de ${syncName}. Verifique os logs.` };
    }
}

export { sincronizar };
