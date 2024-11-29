/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("ordemproducao", (table) => {
    table.increments("OrdemProducaoId").primary();
    table.integer("LoteProducaoId", 19).notNullable();
    table.date("OrdemProducaoDtLote").notNullable();
    table.string("ProdutoCodigo", 20).notNullable();
    table.integer("FamiliaId", 19).notNullable();
    table.string("FamiliaDescricao", 50).notNullable();
    table.decimal("MedidaVendaLargura", 16, 5).notNullable();
    table.decimal("MedidaVendaAltura", 16, 5).notNullable();
    table.decimal("MedidaVendaComprimento", 16, 5).notNullable();
    table.integer("TipoRevestimentoId", 19).notNullable();
    table.string("TipoRevestimentoDescricao", 50).notNullable();
    table.integer("RevestimentoId", 19).notNullable();
    table.string("RevestimentoDescricao", 50).notNullable();
    table.decimal("OrdemProducaoQtdeProgramada", 19, 0).notNullable();
    table.string("OrdemProducaoObs", 180).notNullable();
    table.date("OrdemProducaoDtProgramado").notNullable();
    table.foreign("ProdutoCodigo").references("PecaCodigo").inTable("peca");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("ordemproducao");
}
