import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtém o diretório raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootPath = path.resolve(__dirname, '../../'); // Sobe dois níveis para a raiz

// Carrega o .env da raiz
dotenv.config({ path: path.join(rootPath, '.env') });

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '192.168.100.30',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'f4c1l',
      database: process.env.DB_NAME || 'integrador_produx',
    },
    migrations: {
      directory: path.resolve(rootPath, 'src/data/migrations'),
      stub: './knex-stub.mjs',
    },
    seeds: {
      directory: '../data/seed',
    },
    debug: false,
  },
};
