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
                CEPPOperacaoId: { type: 'integer'},
                EmpresaId: { type: 'integer' },
                EquipamentoId: { type: 'integer' },
                MotivoParadaDescricao: { type: 'string', maxLength: 255 },
                MotivoParadaId: { type: 'integer' },
                MotivoRetrabalhoDescricao: { type: 'string', maxLength: 255 },
                MotivoRetrabalhoId: { type: 'integer' },
                OperadorId: { type: 'integer' },
                OperadorNome: { type: 'string', maxLength: 255 },
                OrdemProducaoId: { type: 'integer' },
                OrdemProducaoCodReferencial: { type: 'string', maxLength: 100 },
                CEPPSincronizado: { type: 'boolean', default: false },
                OperacoesCEPPId: { type: 'integer' },
                OperacoesCEPPDescricao: { type: 'string', maxLength: 50 },
                stSetorId: { type: 'integer' },
                stSetorDescricao: { type: 'string', maxLength: 50 },
            },
        };
    }
}

export default CEPP;
