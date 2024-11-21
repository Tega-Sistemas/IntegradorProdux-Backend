import { Model } from "objection";

class MotivoRetrabalho extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'motivoretrabalho';

    // Define qual coluna será usada como chave primária
    static idColumn = 'MotivoRetrabalhoId';

    static get jsonSchema() {
        return {
            type: "object",
            required: ["MotivoRetrabalhoDescricao"],

            properties: {
                MotivoRetrabalhoId: { type: "integer" },
                MotivoRetrabalhoDescricao: { type: "string", maxLength: 50 },
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

export default MotivoRetrabalho;
