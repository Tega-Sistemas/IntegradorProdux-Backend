import { Model } from "objection";

class Peca extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'peca';

    // Define qual coluna será usada como chave primária
    static idColumn = 'PecaCodigo';

    static get jsonSchema() {
        return {
            type: "object",
            required: ["PecaCodigo", "PecaDescricao", "PecaPesoBruto", "PecaPesoLiquido", "PecaIntegracaoId"],
            properties: {
                PecaCodigo: { type: "string", maxLength: 20 },
                PecaDescricao: { type: "string", maxLength: 50 },
                PecaPesoBruto: { type: "number" },
                PecaPesoLiquido: { type: "number" },
                PecaIntegracaoId: { type: "number" },
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

export default Peca;
