/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("peca", (table) => {
    table.string("PecaCodigo", 20).primary();
    table.string("PecaDescricao", 50).notNullable();
    table.decimal("PecaPesoBruto", 16, 5).notNullable();
    table.decimal("PecaPesoLiquido", 16, 5).notNullable();
    table.decimal("PecaIntegracaoId", 8, 0).notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("peca");
}