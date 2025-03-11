/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('motivoparada', function (table) {
    table.integer('MotivoParadaId', 19).alter();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('motivoparada', function (table) {
    table.decimal('MotivoParadaId', 8, 0).alter();
  })
};
