import { sincronizar as sincronizarEmpresa } from './produxIntegracaoService/sincronizacaoEmpresa.js';
import { sincronizar as sincronizacaoEquipamento } from './produxIntegracaoService/sincronizacaoEquipamento.js';
import { sincronizar as sincronizacaoSetor } from './produxIntegracaoService/sincronizacaoSetor.js';
import { sincronizar as sincronizacaoMotivoParada } from './produxIntegracaoService/sincronizacaoMotivoParada.js';
import { sincronizar as sincronizacaoMotivoRetrabalho } from './produxIntegracaoService/sincronizacaoMotivoRetrabalho.js';
import { sincronizar as sincronizacaoOrdemProducao } from './produxIntegracaoService/sincronizacaoOrdemProducao.js';
import { sincronizar as sincronizacaoPeca } from './produxIntegracaoService/sincronizacaoPeca.js';
import { logInfo, logSucesso } from './logService.js';

async function realizarSincronizacao() {
    try {
        let isError = false;
        let log = '';

        logInfo('Iniciando sincronização dos dados...');

        const resultadoEmpresa = await sincronizarEmpresa();

        if (resultadoEmpresa.status === 'error') {
            isError = true;
            log = resultadoEmpresa.message
        } else {
            let log = 'Empresa sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoSetor = await sincronizacaoSetor();

        if (resultadoSetor.status === 'error') {
            isError = true;
            log = resultadoSetor.message
        } else {
            let log = 'Setores sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoEquipamento = await sincronizacaoEquipamento();

        if (resultadoEquipamento.status === 'error') {
            isError = true;
            log = resultadoEquipamento.message
        } else {
            let log = 'Equipamentos sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoMotParada = await sincronizacaoMotivoParada();

        if (resultadoMotParada.status === 'error') {
            isError = true;
            log = resultadoMotParada.message
        } else {
            let log = 'Motivos de parada sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoMotRetrabalho = await sincronizacaoMotivoRetrabalho();

        if (resultadoMotRetrabalho.status === 'error') {
            isError = true;
            log = resultadoMotRetrabalho.message
        } else {
            let log = 'Motivos de retrabalho sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoPeca = await sincronizacaoPeca();

        if (resultadoPeca.status === 'error') {
            isError = true;
            log = resultadoPeca.message
        } else {
            let log = 'Peças sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        const resultadoOrdemProducao = await sincronizacaoOrdemProducao();

        if (resultadoOrdemProducao.status === 'error') {
            isError = true;
            log = resultadoOrdemProducao.message
        } else {
            let log = 'Ordem de produção sincronizada com sucesso';
            logSucesso(`<p>${log}</p>`);
        }

        if (!isError) {
            let log = 'Finalizada a integração sem erros'
            logSucesso(`<p>${log}</p>`);
            return { status: 'success', message: log };
        }

        return { status: 'error', message: log };

    } catch (error) {
        console.error('Erro na sincronização:', error);
        throw error;
    }
}

export { realizarSincronizacao };
