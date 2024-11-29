/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.string('OrdemProducaoCodReferencial', 100).notNullable().after('ProdutoCodigo');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.dropColumn('OrdemProducaoCodReferencial');
  });
};
8





