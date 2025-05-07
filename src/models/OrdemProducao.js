import { Model } from "objection";

class OrdemProducao extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'ordemproducao';

    // Define qual coluna será usada como chave primária
    static idColumn = 'OrdemProducaoId';

    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                OrdemProducaoId: { type: "number" },
                LoteProducaoId: { type: "number" },
                LoteProducaoERPId: { type: "number" },
                OrdemProducaoDtLote: { type: "string", format: "date" },
                ProdutoCodigo: { type: "string", maxLength: 20 },
                OrdemProducaoCodReferencial: { type: "string", maxLength: 100 },
                FamiliaId: { type: "number" },
                FamiliaDescricao: { type: "string", maxLength: 50 },
                MedidaVendaLargura: { type: "number" },
                MedidaVendaAltura: { type: "number" },
                MedidaVendaComprimento: { type: "number" },
                TipoRevestimentoId: { type: "number" },
                TipoRevestimentoDescricao: { type: "string", maxLength: 50 },
                RevestimentoId: { type: "number" },
                RevestimentoDescricao: { type: "string", maxLength: 50 },
                OrdemProducaoQtdeProgramada: { type: "number" },
                OrdemProducaoObs: { type: "string", maxLength: 180 },
                OrdemProducaoDtProgramado: { type: "string", format: "date" },
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

export default OrdemProducao;
