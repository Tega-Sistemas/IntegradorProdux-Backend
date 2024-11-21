import { Model } from 'objection';
import Setor from './Setor.js';  // Importando o model Setor
import Empresa from './Empresa.js';  // Importando o model Empresa

class Equipamento extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'equipamento';

    // Define qual coluna será usada como chave primária
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
        };
    }

    $beforeUpdate() {
        // Convertendo para o formato 'YYYY-MM-DD HH:MM:SS' que o MySQL espera
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
    }

}

export default Equipamento;
