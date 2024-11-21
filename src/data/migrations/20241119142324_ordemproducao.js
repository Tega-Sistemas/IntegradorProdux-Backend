/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("ordemproducao", (table) => {
    table.decimal("OrdemProducaoId", 8, 0).primary();
    table.decimal("LoteProducaoId", 8, 0).notNullable();
    table.date("OrdemProducaoDtLote").notNullable();
    table.string("ProdutoCodigo", 20).notNullable();
    table.decimal("FamiliaId", 8, 0).notNullable();
    table.string("FamiliaDescricao", 50).notNullable();
    table.decimal("MedidaVendaLargura", 16, 5).notNullable();
    table.decimal("MedidaVendaAltura", 16, 5).notNullable();
    table.decimal("MedidaVendaComprimento", 16, 5).notNullable();
    table.decimal("TipoRevestimentoId", 8, 0).notNullable();
    table.string("TipoRevestimentoDescricao", 50).notNullable();
    table.decimal("RevestimentoId", 8, 0).notNullable();
    table.string("RevestimentoDescricao", 50).notNullable();
    table.decimal("OrdemProducaoQtdeProgramada", 8, 0).notNullable();
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
