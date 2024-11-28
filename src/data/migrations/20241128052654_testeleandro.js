/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable("testeleandro", (table) => {
    table.increments("LeandroId").primary();
    table.string("LeandroNome", 100).defaultTo('tega');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists('testeleandro');
};
