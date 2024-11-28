/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('equipamento', (table) => {
    table.integer('EquipamentoId', 19).primary();
    table.string('EquipamentoDescricao', 50).notNullable();
    table.integer('EquipamentoNroFuncionarios').notNullable();
    table.string('UnidadeSigla', 3).notNullable();
    table.integer('SetorId', 19).notNullable().references('SetorId').inTable('setor');
    table.integer('EmpresaId', 19).notNullable().references('EmpresaId').inTable('empresa');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists('equipamento');
};
