/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.integer('OperacoesCeppId').defaultTo(0);
    table.string('OperacoesCEPPDescricao', 50).defaultTo('');
    table.integer('stSetorId').defaultTo(0);
    table.string('stSetorDescricao', 50).defaultTo('');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.dropColumn('OperacoesCeppId');
    table.dropColumn('OperacoesCEPPDescricao');
    table.dropColumn('stSetorId');
    table.dropColumn('stSetorDescricao');
  })
};
