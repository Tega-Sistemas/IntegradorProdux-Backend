/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema.createTable('cepp', (table) => {
    table.increments('CEPPId').primary();
    table.timestamp('CEPPDtCadastro').notNullable();
    table.timestamp('CEPPDtInicio').notNullable();
    table.timestamp('CEPPDtInicioRelatorio').notNullable();
    table.timestamp('CEPPDtTermino').notNullable();
    table.decimal('CEPPMinutoCentesimal', 10, 2).defaultTo(0);
    table.integer('CEPPProduxId').defaultTo(0);
    table.integer('CEPPQtdePerda').defaultTo(0);
    table.integer('CEPPQtdeProduzida').defaultTo(0);
    table.integer('CEPPQtdeSobra').defaultTo(0);
    table.string('CEPPTipoCEPP', 50).defaultTo('');
    table.integer('EmpresaId').notNullable();
    table.integer('EquipamentoId').notNullable();
    table.string('MotivoParadaDescricao', 255).defaultTo('');
    table.integer('MotivoParadaId').defaultTo(0);
    table.string('MotivoRetrabalhoDescricao', 255).defaultTo('');
    table.integer('MotivoRetrabalhoId').defaultTo(0);
    table.integer('OperadorId').defaultTo(0);
    table.string('OperadorNome', 255).defaultTo('');
    table.integer('OrdemProducaoId').defaultTo(0);
    table.string('OrdemProducaoCodReferencial', 100).defaultTo('');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTableIfExists('cepp');
};
