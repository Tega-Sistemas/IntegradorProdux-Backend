/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('motivoparada', (table) => {
    table.decimal('MotivoParadaId', 8, 0).primary();
    table.string('MotivoParadaDescricao', 50).notNullable();
    table.decimal('MotivoParadaEvitavel', 1, 0).nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('motivoparada');
};
