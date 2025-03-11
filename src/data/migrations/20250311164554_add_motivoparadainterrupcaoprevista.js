/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('motivoparada', function (table) {
    table.string('MotivoParadaInterrupcaoPrevista', 1).defaultTo('N');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('motivoparada', function (table) {
    table.dropColumn('MotivoParadaInterrupcaoPrevista');
  })
};
