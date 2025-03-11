/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.renameColumn('OperacoesCeppId', 'OperacoesCEPPId');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.renameColumn('OperacoesCEPPId', 'OperacoesCeppId');
  })
};
