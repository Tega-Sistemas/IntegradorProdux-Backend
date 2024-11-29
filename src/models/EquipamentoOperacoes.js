import { Model } from "objection";
import Equipamento from "./Equipamento.js";
import Operacoes from "./Operacoes.js";

class EquipamentoOperacoes extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'equipamentooperacoes';

    // Define as colunas que compõem a chave primária
    static idColumn = ['EquipamentoId', 'OperacoesId'];

    static get jsonSchema() {
        return {
            type: "object",
            required: ["EquipamentoId", "OperacoesId"], // Colunas obrigatórias
            properties: {
                EquipamentoId: { type: "integer" },
                OperacoesId: { type: "integer" },
            },
        };
    }

    static get relationMappings() {
        return {
            equipamento: {
                relation: Model.BelongsToOneRelation,
                modelClass: Equipamento,
                join: {
                    from: 'equipamentooperacoes.EquipamentoId',
                    to: 'equipamento.EquipamentoId',
                },
            },
            operacoes: {
                relation: Model.BelongsToOneRelation,
                modelClass: Operacoes,
                join: {
                    from: 'equipamentooperacoes.OperacoesId',
                    to: 'operacoes.OperacoesId',
                },
            },
        };
    }
}

export default EquipamentoOperacoes;
