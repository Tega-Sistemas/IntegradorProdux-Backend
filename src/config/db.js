import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from './knexfile.js';

// Inicialize o Knex
const knex = Knex(knexConfig);

// Vincule o Objection ao Knex
Model.knex(knex);

export default { knex };
