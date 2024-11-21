import { v4 as uuidv4, v4 } from 'uuid';
import Log from '../models/Log.js';

// Função para registrar um log
async function registrarLog(level, message) {
    try {
        let uuid = uuidv4();
        console.log(uuid);

        // Limitar o tamanho da mensagem
        const maxMessageLength = 1024; // Tamanho máximo permitido para a mensagem
        if (message.length > maxMessageLength) {
            message = message.substring(0, maxMessageLength); // Trunca a mensagem
        }

        // Registrar o log na tabela 'logs'
        await Log.query().insert({
            id: uuid,
            level,
            message
        });

        console.log(`[${level}] ${message}`);
    } catch (error) {
        console.error('Erro ao registrar log:', error);
    }
}

export { registrarLog };


// Função para registrar um log de INFO
async function logInfo(message) {
    await registrarLog('INFO', message);
}

// Função para registrar um log de SUCESSO
async function logSucesso(message) {
    await registrarLog('SUCESSO', message);
}

// Função para registrar um log de ERRO
async function logErro(message, stackTrace) {
    await registrarLog('ERRO', message, stackTrace);
}

export { logInfo, logSucesso, logErro };
