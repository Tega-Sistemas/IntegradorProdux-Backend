/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.integer('CEPPOrdemAgrupadora').defaultTo(0);
    table.integer('TurnoProdutivoDiaSemana').defaultTo(0);
    table.integer('TurnoProdutivoTurno').defaultTo(0);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('cepp', function (table) {
    table.dropColumn('CEPPOrdemAgrupadora');
    table.dropColumn('TurnoProdutivoDiaSemana');
    table.dropColumn('TurnoProdutivoTurno');
  })
};
