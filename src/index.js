import express from 'express';
import { Model } from 'objection';
import Knex from 'knex';
import 'dotenv/config'; // carrega as variáveis de ambiente
import cron from 'node-cron';
import cors from 'cors';
import knexConfig from './config/knexfile.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import Agenda from './models/Agenda.js';
import { realizarSincronizacao } from './services/sincronizacaoService.js';
import { realizarSincronizacao as realizarSincronizacaoERP } from './services/sincronizacaoErpService.js';
import { validarApiKey } from './middlewares/validarApiKey.js';
import { verifyToken } from './middlewares/authMiddleware.js';
import { getMe } from './controllers/authController.js';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));
app.use('/v1/me', verifyToken, getMe);
app.use(validarApiKey);

app.use('/', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const AGENDA_UPDATE_INTERVAL_MINUTES = parseInt(process.env.AGENDA_UPDATE_INTERVAL_MINUTES, 10) || 10;

const cronTasks = new Map();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  iniciarAgendador();
});

async function iniciarAgendador() {
  try {
    await atualizarAgendas();

    cron.schedule(`*/${AGENDA_UPDATE_INTERVAL_MINUTES} * * * *`, atualizarAgendas);
  } catch (error) {
    console.error('Erro ao configurar agendadores:', error);
  }
}

async function atualizarAgendas() {
  try {
    console.log('Carregando e atualizando agendas do tipo 2 (Envio ao PRODUX)...');
    const agendas = await Agenda.query().where('Tipo', 2);

    agendas.forEach((agenda) => {
      const horario = agenda.Horario;
      const [hora, minuto] = horario.split(':');
      const cronExpression = `${minuto} ${hora} * * *`;

      if (cronTasks.has(agenda.AgendaId)) {
        cronTasks.get(agenda.AgendaId).stop();
        cronTasks.delete(agenda.AgendaId);
      }

      const task = cron.schedule(cronExpression, async () => {
        console.log(`Executando sincronização para agenda ID: ${agenda.AgendaId}`);
        try {
          await realizarSincronizacao(agenda);
        } catch (error) {
          console.error(`Erro ao sincronizar agenda ID: ${agenda.AgendaId}`, error);
        }
      });

      cronTasks.set(agenda.AgendaId, task);
    });

    console.log(`Agendas atualizadas. Total: ${agendas.length}`);
  } catch (error) {
    console.error('Erro ao atualizar as agendas:', error);
  }

  try {
    console.log('Carregando e atualizando agendas do tipo 3 (Envio ao ERP)...');
    const agendas = await Agenda.query().where('Tipo', 3);

    agendas.forEach((agenda) => {
      const horario = agenda.Horario;
      const [hora, minuto] = horario.split(':');
      const cronExpression = `${minuto} ${hora} * * *`;

      if (cronTasks.has(agenda.AgendaId)) {
        cronTasks.get(agenda.AgendaId).stop();
        cronTasks.delete(agenda.AgendaId);
      }

      const task = cron.schedule(cronExpression, async () => {
        console.log(`Executando sincronização para agenda ID: ${agenda.AgendaId}`);
        try {
          await realizarSincronizacaoERP(agenda);
        } catch (error) {
          console.error(`Erro ao sincronizar agenda ID: ${agenda.AgendaId}`, error);
        }
      });

      cronTasks.set(agenda.AgendaId, task);
    });

    console.log(`Agendas atualizadas. Total: ${agendas.length}`);
  } catch (error) {
    console.error('Erro ao atualizar as agendas:', error);
  }
}
