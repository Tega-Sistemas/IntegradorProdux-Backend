import { Model } from "objection";

class Roteiro extends Model {
    static get tableName() {
        return "roteiro";
    }

    static get idColumn() {
        return "RoteiroId";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["RoteiroId", "SetorId", "EquipamentoId", "OperacoesCEPPId", "MedidaPeca", "OrdemDoSetor"],
            properties: {
                RoteiroId: { type: "number" },
                PecaCodigo: { type: "string" },
                SetorId: { type: "number" },
                EquipamentoId: { type: "number" },
                OperacoesCEPPId: { type: "number" },
                MedidaPeca: { type: "number" },
                OrdemDoSetor: { type: "number" },
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

export default Roteiro;