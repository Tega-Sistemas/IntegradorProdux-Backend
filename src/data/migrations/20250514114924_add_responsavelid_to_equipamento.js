/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.alterTable('equipamento', (table) => {
    table.integer('ResponsavelId').after('EmpresaId').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.alterTable('equipamento', (table) => {
    table.dropColumns([
      "ResponsavelId",
    ])
  });
};
