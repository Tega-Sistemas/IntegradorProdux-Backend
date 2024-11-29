import { Model } from 'objection';

class Empresa extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'empresa';

    // Define qual coluna será usada como chave primária
    static idColumn = 'EmpresaId';

    static jsonSchema = {
        type: 'object',
        properties: {
            EmpresaId: { type: 'integer' },
            EmpresaNome: { type: 'string' },
            EmpresaCNPJ: { type: 'string' },
            EmpresaNomeInterno: { type: 'string' },
            EmpresaNomeFantasia: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
        },
    };

    $beforeUpdate() {
        // Convertendo para o formato 'YYYY-MM-DD HH:MM:SS' que o MySQL espera
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
    }

}

export default Empresa;