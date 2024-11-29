/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.string('ProdutoNomeAbreviado', 40).notNullable().after('ProdutoCodigo');
    table.string('ProdutoDescricao', 50).notNullable().after('ProdutoNomeAbreviado');
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





