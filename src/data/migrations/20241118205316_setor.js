/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('setor', (table) => {
    table.integer('SetorId', 19).notNullable().primary();
    table.string('SetorDescricao', 50).notNullable();
    table.date('SetorDtInclusao').notNullable();
    table.string('SetorDescricaoAbreviacao', 50).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('setor');
};