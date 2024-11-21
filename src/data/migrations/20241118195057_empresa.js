/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable('empresa', (table) => {
        table.increments('EmpresaId').primary();
        table.string('EmpresaNome', 50).notNullable();
        table.string('EmpresaCNPJ', 50).notNullable();
        table.string('EmpresaNomeInterno', 50).notNullable();
        table.string('EmpresaNomeFantasia', 50).notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.dropTableIfExists('empresa');
};