/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("equipamentooperacoes", (table) => {
    table.integer("EquipamentoId").unsigned().notNullable();
    table.integer("OperacoesId").unsigned().notNullable();
    table.primary(["EquipamentoId", "OperacoesId"]);

    table
      .foreign("EquipamentoId")
      .references("EquipamentoId")
      .inTable("equipamento");

    table
      .foreign("OperacoesId")
      .references("OperacoesId")
      .inTable("operacoes");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("equipamentooperacoes");
}
