import { Model } from 'objection';
import Setor from './Setor.js';
import Empresa from './Empresa.js';
import Operacoes from './Operacoes.js';

class Equipamento extends Model {
    static tableName = 'equipamento';
    static idColumn = 'EquipamentoId';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['EquipamentoDescricao', 'EquipamentoNroFuncionarios', 'UnidadeSigla'],
            properties: {
                EquipamentoId: { type: 'integer' },
                EquipamentoDescricao: { type: 'string', maxLength: 50 },
                EquipamentoNroFuncionarios: { type: 'integer' },
                UnidadeSigla: { type: 'string', maxLength: 3 },
                SetorId: { type: 'integer' },
                EmpresaId: { type: 'integer' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    // Relacionamentos
    static get relationMappings() {
        return {
            setor: {
                relation: Model.BelongsToOneRelation,
                modelClass: Setor,
                join: {
                    from: 'equipamento.SetorId',
                    to: 'setor.SetorId',
                },
            },
            empresa: {
                relation: Model.BelongsToOneRelation,
                modelClass: Empresa,
                join: {
                    from: 'equipamento.EmpresaId',
                    to: 'empresa.EmpresaId',
                },
            },
            operacoes: {
                relation: Model.ManyToManyRelation,
                modelClass: Operacoes,
                join: {
                    from: 'equipamento.EquipamentoId',
                    through: {
                        from: 'equipamentooperacoes.EquipamentoId',
                        to: 'equipamentooperacoes.OperacoesId',
                    },
                    to: 'operacoes.OperacoesId',
                },
            },
        };
    }

    $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    $formatJson(json) {
        const formattedJson = super.$formatJson(json);
        if (formattedJson.operacoes) {
            formattedJson.Operacoes = formattedJson.operacoes;
            delete formattedJson.operacoes;
        }
        return formattedJson;
    }
}

export default Equipamento;
