import { Model } from 'objection';

class Setor extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'setor';

    // Define qual coluna será usada como chave primária
    static idColumn = 'SetorId';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['SetorDescricao', 'SetorDtInclusao', 'SetorDescricaoAbreviacao'],

            properties: {
                SetorId: { type: 'integer' },
                SetorDescricao: { type: 'string', maxLength: 50 },
                SetorDtInclusao: { type: 'string', format: 'date' },
                SetorDescricaoAbreviacao: { type: 'string', maxLength: 50 },
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

export default Setor;
