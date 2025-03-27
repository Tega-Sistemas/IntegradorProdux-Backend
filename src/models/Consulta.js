import { Model } from 'objection';

class Consulta extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'consultas';

    // Define qual coluna será usada como chave primária
    static idColumn = 'id';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['nome_tabela', 'nome_modelo', 'comando_sql', 'usuario_criacao'],

            properties: {
                id: { type: 'integer' },
                nome_metadata: { type: 'string', minLength: 1, maxLength: 255 },
                nome_tabela: { type: 'string', minLength: 1, maxLength: 255 },
                nome_modelo: { type: 'string', minLength: 1, maxLength: 255 },
                nome_arquivo: { type: 'string', minLength: 1, maxLength: 255 },
                comando_sql: { type: 'string' },
                filtros_colunas: { type: 'string' },
                formatar_valores: { type: 'string' },
                update_on_duplicate: { type: 'boolean' },
                expandir_ordem: { type: 'string' },
                colunas_duplicidade: { type: 'string' },
                usuario_criacao: { type: 'string', minLength: 1, maxLength: 255 },
                usuario_alteracao: { type: 'string', minLength: 1, maxLength: 255 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    async $beforeInsert() {
        const date = new Date();
        this.created_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
        this.updated_at = this.created_at;
    }

    async $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
    }
}

export default Consulta;
