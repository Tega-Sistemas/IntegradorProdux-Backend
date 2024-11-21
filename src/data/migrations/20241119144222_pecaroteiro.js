/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("pecaroteiro", (table) => {
    table.string("PecaCodigo", 20).notNullable();
    table.decimal("RoteiroId", 8, 0).notNullable();
    table.primary(["PecaCodigo", "RoteiroId"]);
    table
      .foreign("PecaCodigo")
      .references("PecaCodigo")
      .inTable("peca");
    table
      .foreign("RoteiroId")
      .references("RoteiroId")
      .inTable("roteiro");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // Aqui você pode definir o rollback da migration
};
