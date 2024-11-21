/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("agenda", (table) => {
    table.increments("AgendaId").primary();
    table.time("Horario").notNullable();
    table.integer("Tipo").notNullable().comment("1: Extração, 2: Envio ao ERP");
    table.timestamp("CriadoEm").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("AlteradoEm").defaultTo(knex.fn.now()).notNullable();
    table.string("UsuarioCriacao", 50).notNullable();
    table.string("UsuarioAlteracao", 50).notNullable();
  });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("agenda");
}