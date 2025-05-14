/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.integer('OrdemProducaoAcabadoCodigo').after('OrdemProducaoDtProgramado').defaultTo(0);
    table.string('OrdemProducaoAcabadoDescricao').after('OrdemProducaoAcabadoCodigo').defaultTo("");
    table.integer('OrdemProducaoAcabadoRevId').after('OrdemProducaoAcabadoDescricao').defaultTo(0);
    table.string('OrdemProducaoAcabadoRevDesc').after('OrdemProducaoAcabadoRevId').defaultTo("");
    table.integer('OrdemProducaoAcabadoTpRevId').after('OrdemProducaoAcabadoRevDesc').defaultTo(0);
    table.string('OrdemProducaoAcabadoTpRevDesc').after('OrdemProducaoAcabadoTpRevId').defaultTo("");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.alterTable('ordemproducao', (table) => {
    table.dropColumns([
      "OrdemProducaoAcabadoCodigo",
      "OrdemProducaoAcabadoDescricao",
      "OrdemProducaoAcabadoRevId",
      "OrdemProducaoAcabadoRevDesc",
      "OrdemProducaoAcabadoTpRevId",
      "OrdemProducaoAcabadoTpRevDesc"
    ])
  });
};
