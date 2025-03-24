/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('consultas', function (table) {
    table.text('filtros_colunas');
    table.text('formatar_valores');
    table.boolean('update_on_duplicate').defaultTo(true);
    table.text('expandir_ordem');
    table.text('colunas_duplicidade');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('consultas', function (table) {
    table.dropColumns('filtros_colunas', 'formatar_valores', 'update_on_duplicate', 'expandir_ordem', 'colunas_duplicidade');
  })
};
