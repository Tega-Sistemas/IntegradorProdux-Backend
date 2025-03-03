import { logInfo, logErro } from './logService.js';
import { sincronizar as sincronizarCicloProdutivo } from './produxTekSystemService/sincronizacaoCicloProdutivo.js';

async function realizarSincronizacao() {
  try {
    let isError = false;
        let log = '';

        logInfo('<p>Iniciando sincronização dos dados com ERP...</p>');

        const cicloProdutivo = await sincronizarCicloProdutivo();

        return { ...cicloProdutivo };
    
  } catch (error) {
    logErro('<p>Erro na sincronização dos dados para o ERP.</p>')
    throw error;
  }
}

export { realizarSincronizacao };