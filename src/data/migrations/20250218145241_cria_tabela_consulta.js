/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable('consultas', (table) => {
    table.increments('id').primary();
    table.string('nome_tabela', 255).notNullable();
    table.string('nome_modelo', 255).notNullable();
    table.string('nome_arquivo', 255).notNullable();
    table.text('comando_sql').notNullable();
    table.string('usuario_criacao', 255).notNullable();
    table.string('usuario_alteracao', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists('consultas');
};
