/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('equipamento', function (table) {
    table.string('OperadorNome', 50).defaultTo('').after('EmpresaId');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('equipamento', function (table) {
    table.dropColumn('OperadorNome');
  });
};
