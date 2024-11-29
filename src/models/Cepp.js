import { Model } from 'objection';

class CEPP extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'cepp';

    // Define qual coluna será usada como chave primária
    static idColumn = 'CEPPId';

    // Esquema de validação JSON
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['CEPPDtCadastro', 'CEPPDtInicio', 'CEPPDtInicioRelatorio', 'CEPPDtTermino', 'EmpresaId', 'EquipamentoId'],
            properties: {
                CEPPId: { type: 'integer' },
                CEPPDtCadastro: { type: 'string', format: 'date-time' },
                CEPPDtInicio: { type: 'string', format: 'date-time' },
                CEPPDtInicioRelatorio: { type: 'string', format: 'date-time' },
                CEPPDtTermino: { type: 'string', format: 'date-time' },
                CEPPMinutoCentesimal: { type: 'number' },
                CEPPProduxId: { type: 'integer' },
                CEPPQtdePerda: { type: 'integer' },
                CEPPQtdeProduzida: { type: 'integer' },
                CEPPQtdeSobra: { type: 'integer' },
                CEPPTipoCEPP: { type: 'string', maxLength: 50 },
                EmpresaId: { type: 'integer' },
                EquipamentoId: { type: 'integer' },
                MotivoParadaDescricao: { type: 'string', maxLength: 255 },
                MotivoParadaId: { type: 'integer' },
                MotivoRetrabalhoDescricao: { type: 'string', maxLength: 255 },
                MotivoRetrabalhoId: { type: 'integer' },
                OperadorId: { type: 'integer' },
                OperadorNome: { type: 'string', maxLength: 255 },
                OrdemProducaoId: { type: 'integer' },
                OrdemProducaoCodReferencial: { type: 'string', maxLength: 100 }
            },
        };
    }

    $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' ');
    }
}

export default CEPP;
