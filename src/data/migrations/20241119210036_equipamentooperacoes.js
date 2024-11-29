/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("equipamentooperacoes", (table) => {
    table.integer('EquipamentoId', 19).notNullable().references('EquipamentoId').inTable('equipamento');
    table.integer('OperacoesId', 19).notNullable().references('OperacoesId').inTable('operacoes');
    table.primary(["EquipamentoId", "OperacoesId"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("equipamentooperacoes");
}
