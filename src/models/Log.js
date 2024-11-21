import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';

class Log extends Model {
    static get tableName() {
        return 'logs';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },  // Define o formato como UUID
                level: { type: 'string' },
                message: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    // Método para gerar o UUID automaticamente antes de inserir
    async $beforeInsert(queryContext) {
        this.id = uuidv4();  // Gera o UUID antes de inserir
    }
}

export default Log;
