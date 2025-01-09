import bcrypt from 'bcryptjs';
import { Model } from 'objection';

class Usuario extends Model {
    // Define o nome da tabela no banco de dados
    static tableName = 'usuarios';

    // Define qual coluna será usada como chave primária
    static idColumn = 'id';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['nome', 'email'],

            properties: {
                id: { type: 'integer' },
                nome: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string', format: 'email' },
                usuario: { type: 'string' },
                senha: { type: 'string' },
                role: {
                    type: 'string',
                    enum: ['admin', 'user'],
                    default: 'user'
                },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        };
    }

    async $beforeUpdate() {
        const date = new Date();
        this.updated_at = date.toISOString().slice(0, 19).replace('T', ' '); // Converte para 'YYYY-MM-DD HH:MM:SS
        if (this.senha) {
            this.senha = await bcrypt.hash(this.senha, 10);
        }
    }

    async $beforeInsert() {
        if (this.senha) {
            this.senha = await bcrypt.hash(this.senha, 10);
        }
    }
}

export default Usuario;
