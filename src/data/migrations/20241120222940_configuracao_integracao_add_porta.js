/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('configuracao_integracao', (table) => {
    table.integer('porta').notNullable().defaultTo(8080);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('configuracao_integracao', (table) => {
    table.dropColumn('porta');
  });
}
