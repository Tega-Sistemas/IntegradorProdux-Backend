import Knex from 'knex';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('logs', (table) => {
    table.string('id', 36).primary();
    table.string('level');
    table.text('message');  // Usa 'text' para garantir que seja um tipo de dado grande
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('logs');
}
