/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('equipamento', (table) => {
    table.increments('EquipamentoId').primary();
    table.string('EquipamentoDescricao', 50).notNullable();
    table.integer('EquipamentoNroFuncionarios').notNullable();
    table.string('UnidadeSigla', 3).notNullable();
    table.integer('SetorId').unsigned().nullable().references('SetorId').inTable('setor');
    table.integer('EmpresaId').unsigned().nullable().references('EmpresaId').inTable('empresa');
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
