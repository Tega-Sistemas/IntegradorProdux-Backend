/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('consultas', function (table) {
    table.string('nome_metadata', 255).after('id').notNullable();
    table.boolean('active').defaultTo(true).after('usuario_alteracao');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('consultas', function (table) {
    table.dropColumn('nome_metadata');
    table.dropColumn('active');
  })
};
