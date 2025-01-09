/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // Aqui você pode definir a estrutura da sua migration
  await knex.schema.table('usuarios', function(table) {
    table.string('role').notNullable().defaultTo('user'); // Add 'role' column with a default value of 'user'
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // Aqui você pode definir o rollback da migration
  await knex.schema.table('usuarios', function(table) {
    table.dropColumn('role'); // Rollback by removing the 'role' column
  });
};
