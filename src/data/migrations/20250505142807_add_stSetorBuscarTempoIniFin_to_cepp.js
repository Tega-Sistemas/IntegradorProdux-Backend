/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.integer('stSetorBuscarTempoIniFin').defaultTo(0).after('stSetorDescricao');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.dropColumn('stSetorBuscarTempoIniFin');
  })
};
