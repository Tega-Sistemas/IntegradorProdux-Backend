import { Model } from "objection";

class Operacoes extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'operacoes';

    // Define qual coluna será usada como chave primária
    static idColumn = 'OperacoesId';

    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                OperacoesId: { type: "integer" },
                OperacoesCEPPDescricao: { type: "string", maxLength: 50 },
                EquipamentoOperacaoCicloPadrao: { type: "integer" },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' ');
    }
}

export default Operacoes;