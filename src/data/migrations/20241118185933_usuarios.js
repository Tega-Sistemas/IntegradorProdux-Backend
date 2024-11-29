/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('nome', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('usuario', 50).unique().notNullable();
        table.string('senha', 255).notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.dropTable('usuarios');
};
