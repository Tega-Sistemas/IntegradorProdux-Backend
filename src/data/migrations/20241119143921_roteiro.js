/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("roteiro", (table) => {
    table.increments("RoteiroId").primary();
    table.string("PecaCodigo", 20, 0).notNullable();
    table.decimal("SetorId", 19, 0).notNullable();
    table.decimal("EquipamentoId", 19, 0).notNullable();
    table.decimal("OperacoesCEPPId", 19, 0).notNullable();
    table.decimal("MedidaPeca", 16, 5).notNullable();
    table.decimal("QtdeMinuto", 16, 5).notNullable();
    table.decimal("OrdemDoSetor", 8, 0).notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("roteiro");
}