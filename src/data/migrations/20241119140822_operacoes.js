/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("operacoes", (table) => {
    table.integer("OperacoesId", 19).primary();
    table.string("OperacoesCEPPDescricao", 50).nullable();
    table.integer("EquipamentoOperacaoCicloPadrao").nullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("operacoes");
}
