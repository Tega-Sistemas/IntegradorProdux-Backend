import { logInfo, logSucesso } from './logService.js';
import { sincronizar as sincronizarCicloProdutivo } from './produxTekSystemService/sincronizacaoCicloProdutivo.js';

async function realizarSincronizacao() {
  try {
    let isError = false;
        let log = '';

        logInfo('<p>Iniciando sincronização dos dados com ERP...</p>');

        const cicloProdutivo = await sincronizarCicloProdutivo();

        return { cicloProdutivo, status: 'success', message: 'teste' };
    
  } catch (error) {
    console.error('Erro na sincronização: ', error)
    throw error;
  }
}

export { realizarSincronizacao };