import 'dotenv/config'; // Carrega as variáveis de ambiente

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
      directory: '../data/migrations',
      stub: './knex-stub.mjs',
    },
    seeds: {
      directory: '../data/seed',
    },
    debug: false,
  },
};
