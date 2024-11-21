import { Model } from 'objection';

class ConfiguracaoIntegracao extends Model {
  // Define o nome da tabela no banco de dados
  static tableName = 'configuracao_integracao';

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ip', 'tipo_conexao', 'nome_aplicacao', 'tipo_integracao'],
      properties: {
        id: { type: 'integer' },
        ip: { type: 'string', maxLength: 45 },
        tipo_conexao: { type: 'string', enum: ['http', 'https'] },
        nome_aplicacao: { type: 'string', maxLength: 100 },
        tipo_integracao: { type: 'integer' },
        porta: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  $beforeUpdate() {
    const date = new Date();
    this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
  }
}

export default ConfiguracaoIntegracao;
