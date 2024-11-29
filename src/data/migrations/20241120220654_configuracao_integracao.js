/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('configuracao_integracao', (table) => {
    table.increments('id').primary(); // ID autoincremental
    table.string('ip', 45).notNullable(); // IP da integração
    table.enu('tipo_conexao', ['http', 'https']).notNullable(); // Tipo de conexão
    table.string('nome_aplicacao', 100).notNullable(); // Nome da aplicação
    table.integer('tipo_integracao').notNullable().defaultTo(1); // Tipo de integração com enum
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Data de criação
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Data de última atualização
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('configuracao_integracao');
}
