import express from 'express';
import { Model } from 'objection';
import Knex from 'knex';
import dotenv from 'dotenv';
import cron from 'node-cron';
import knexConfig from './config/knexfile.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import Agenda from './models/Agenda.js';
import { realizarSincronizacao } from './services/sincronizacaoService.js';
import { validarApiKey } from './middlewares/validarApiKey.js'; // Importando o middleware

dotenv.config();

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = express();
app.use(express.json());

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
      console.log('Cron: ' + cronExpression);

      if (cronTasks.has(agenda.AgendaId)) {
        console.log('agenda: ' + agenda);

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
}
