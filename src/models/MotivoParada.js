import { Model } from 'objection';

class MotivoParada extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'motivoparada';

    // Define qual coluna será usada como chave primária
    static idColumn = 'MotivoParadaId';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['MotivoParadaDescricao'], // Coluna obrigatória

            properties: {
                MotivoParadaId: { type: 'integer' },
                MotivoParadaDescricao: { type: 'string', maxLength: 50 },
                MotivoParadaEvitavel: { type: 'integer' },
                MotivoParadaInterrupcaoPrevista: { type: 'string' },
                MotivoParadaTpErpExterno: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    $beforeUpdate() {
        // Convertendo para o formato 'YYYY-MM-DD HH:MM:SS' que o MySQL espera
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS'
    }

}

export default MotivoParada;
