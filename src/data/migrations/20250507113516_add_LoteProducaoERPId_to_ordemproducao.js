/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.integer('LoteProducaoERPId').notNullable().after('LoteProducaoId').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.dropColumn('LoteProducaoERPId');
  });
};





