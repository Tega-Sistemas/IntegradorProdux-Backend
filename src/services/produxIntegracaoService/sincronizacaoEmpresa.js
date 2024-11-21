import axios from 'axios';
import ConfiguracaoIntegracao from '../../models/ConfiguracaoIntegracao.js';
import Empresa from '../../models/Empresa.js';
import { logErro } from '../logService.js';

async function sincronizarEmpresa() {

    const syncName = 'empresa'
    var data;

    try {
        const configuracao = await ConfiguracaoIntegracao.query().where('tipo_integracao', 1);
        const token = process.env.PRODUX_TOKEN;
        var urlExterna;
        console.log(configuracao.length);
        if (configuracao.length > 0) {
            configuracao.forEach(item => {
                urlExterna = `${item.tipo_conexao}://${item.ip}:${item.porta}/${item.nome_aplicacao}/Api/IntegracaoProdux/empresas`;
            });
        } else {
            let log = `Não foi encontrada configuração na integração - ${syncName}`
            logErro(`<p>${log}</p>`);
            return { status: 'error', message: log };
        }

        const empresas = await Empresa.query().select('EmpresaId', 'EmpresaNome', 'EmpresaCNPJ', 'EmpresaNomeInterno', 'EmpresaNomeFantasia');

        data = {
            "Empresa": empresas
        };

        await axios.post(urlExterna, data, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        return { status: 'success', message: 'Sincronização de empresas concluída' };
    } catch (error) {
        if (error.response) {
            const erroResponse = {
                status: error.response.status,
                data: error.response.data ? JSON.stringify(error.response.data, null, 2) : 'Sem dados',
                headers: error.response.headers ? JSON.stringify(error.response.headers, null, 2) : 'Sem cabeçalhos'
            };

            let log = `<p>Erro ao processar os dados ${syncName} - Erro na resposta da API:</p>` +
                `<p>Status: ${erroResponse.status}</p>` +
                `<p>Data: ${erroResponse.data}</p>` +
                `<p>Headers: ${erroResponse.headers}</p>` +
                `<p>Json: ${JSON.stringify(data)}</p>`

            logErro(log);
        } else if (error.request) {
            logErro(`<p>Erro na requisição ${syncName}(sem resposta): request: ${error.request ? error.request : 'Sem dados de requisição'}</p>`);
        } else {
            logErro(`<p>Erro ao configurar a requisição (message: ${error.message})</p>`);
        }

        return { status: 'error', message: `Erro na sincronização de ${syncName}. Por favor, verifique os logs.` };
    }
}

export { sincronizarEmpresa };
