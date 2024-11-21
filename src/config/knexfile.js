import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '192.168.0.213',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'f4c1l',
      database: process.env.DB_NAME || 'integrador_produx',
    },
    migrations: {
      directory: '../data/migrations',
      stub: './knex-stub.mjs',
    },
  },
};
