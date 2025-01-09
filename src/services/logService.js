import { v4 as uuidv4 } from 'uuid';
import Log from '../models/Log.js';

async function registrarLog(level, message) {
    try {
        let uuid = uuidv4();

        await Log.query().insert({
            id: uuid,
            level,
            message
        });

    } catch (error) {
        console.error('Erro ao registrar log:', error);
    }
}

export { registrarLog };


async function logInfo(message) {
    await registrarLog('INFO', message);
}

async function logSucesso(message) {
    await registrarLog('SUCESSO', message);
}

async function logErro(message, stackTrace) {
    await registrarLog('ERRO', message, stackTrace);
}

export { logInfo, logSucesso, logErro };
