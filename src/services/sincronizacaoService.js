import { sincronizarEmpresa } from './sincronizacaoEmpresa.js';
import { logInfo, logSucesso, logErro } from './logService.js';

async function realizarSincronizacao() {
    try {
        let isError = false;
        let log = '';

        logInfo('Iniciando sincronização da empresa...');

        const resultadoEmpresa = await sincronizarEmpresa();

        if (resultadoEmpresa.status === 'error') {
            isError = true;
            log = resultadoEmpresa.message
        }

        if (!isError) {
            return { status: 'success', message: 'Sincronização realizada com sucesso' };
        }

        return { status: 'error', message: log };

    } catch (error) {
        console.error('Erro na sincronização:', error);
        throw error;
    }
}

export { realizarSincronizacao };
