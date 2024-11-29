/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("motivoretrabalho", (table) => {
    table.integer("MotivoRetrabalhoId", 19).primary(); // Chave primária auto incrementada
    table.string("MotivoRetrabalhoDescricao", 50).notNullable(); // Campo obrigatório
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists("motivoretrabalho");
};
