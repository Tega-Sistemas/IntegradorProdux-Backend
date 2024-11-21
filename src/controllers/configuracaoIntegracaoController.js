import ConfiguracaoIntegracao from '../models/ConfiguracaoIntegracao.js';
import TiposIntegracao from '../utils/TiposIntegracao.js';

// Função para criar uma nova configuração de integração
export const criarConfiguracaoIntegracao = async (req, res) => {
    const { ip, tipo_conexao, nome_aplicacao, tipo_integracao } = req.body;

    try {
        // Validar tipo de integração
        if (!TiposIntegracao[tipo_integracao]) {
            return res.status(400).json({ error: 'Tipo de integração inválido' + tipo_integracao });
        }

        const novaConfiguracao = await ConfiguracaoIntegracao.query().insert({
            ip,
            tipo_conexao,
            nome_aplicacao,
            tipo_integracao,
        });

        res.status(201).json(novaConfiguracao);
    } catch (error) {
        console.error('Erro ao criar configuração:', error);
        res.status(500).json({ error: 'Erro ao criar configuração de integração' });
    }
};

// Função para listar todas as configurações de integração
export const listarConfiguracoesIntegracao = async (req, res) => {
    try {
        const configuracoes = await ConfiguracaoIntegracao.query();

        // Formatar a resposta para incluir o nome do tipo de integração
        const configuracoesFormatadas = configuracoes.map((config) => ({
            ...config,
            tipo_integracao_nome: TiposIntegracao[config.tipo_integracao],
        }));

        res.status(200).json(configuracoesFormatadas);
    } catch (error) {
        console.error('Erro ao listar configurações:', error);
        res.status(500).json({ error: 'Erro ao listar configurações de integração' });
    }
};

// Função para obter uma configuração específica pelo ID
export const obterConfiguracaoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const configuracao = await ConfiguracaoIntegracao.query().findById(id);

        if (!configuracao) {
            return res.status(404).json({ error: 'Configuração não encontrada' });
        }

        // Incluir o nome do tipo de integração na resposta
        configuracao.tipo_integracao_nome = TiposIntegracao[configuracao.tipo_integracao];

        res.status(200).json(configuracao);
    } catch (error) {
        console.error('Erro ao obter configuração:', error);
        res.status(500).json({ error: 'Erro ao obter configuração de integração' });
    }
};

// Função para atualizar uma configuração existente
export const atualizarConfiguracaoIntegracao = async (req, res) => {
    const { id } = req.params;
    const { ip, tipo_conexao, nome_aplicacao, tipo_integracao } = req.body;

    try {        
        // Validar tipo de integração
        if (!TiposIntegracao[tipo_integracao]) {
            return res.status(400).json({ error: 'Tipo de integração inválido'});
        }

        const configuracaoAtualizada = await ConfiguracaoIntegracao.query()
            .findById(id)
            .patch({ ip, tipo_conexao, nome_aplicacao, tipo_integracao });

        if (!configuracaoAtualizada) {
            return res.status(404).json({ error: 'Configuração não encontrada' });
        }

        res.status(200).json({ message: 'Configuração atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        res.status(500).json({ error: 'Erro ao atualizar configuração de integração' });
    }
};

// Função para excluir uma configuração
export const excluirConfiguracaoIntegracao = async (req, res) => {
    const { id } = req.params;

    try {
        const configuracaoExcluida = await ConfiguracaoIntegracao.query().deleteById(id);

        if (!configuracaoExcluida) {
            return res.status(404).json({ error: 'Configuração não encontrada' });
        }

        res.status(200).json({ message: 'Configuração excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir configuração:', error);
        res.status(500).json({ error: 'Erro ao excluir configuração de integração' });
    }
};
