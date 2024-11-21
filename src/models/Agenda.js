import { Model } from "objection";

class Agenda extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'agenda';

    // Define qual coluna será usada como chave primária
    static idColumn = 'AgendaId';

    static get jsonSchema() {
        return {
            type: "object",
            required: ["Horario", "Tipo", "UsuarioCriacao", "UsuarioAlteracao"],
            properties: {
                AgendaId: { type: "integer" },
                Horario: { type: "string", format: "time" },
                Tipo: { type: "integer", enum: [1, 2] },
                CriadoEm: { type: "string", format: "date-time" },
                AlteradoEm: { type: "string", format: "date-time" },
                UsuarioCriacao: { type: "string", maxLength: 50 },
                UsuarioAlteracao: { type: "string", maxLength: 50 },
            },
        };
    }

    static get TipoEnum() {
        return {
            EXTRACAO: 1,
            ENVIO_ERP: 2,
        };
    }

    $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' ');
    }

}

export default Agenda;
