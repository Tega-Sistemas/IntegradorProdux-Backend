import Operacoes from "../models/Operacoes.js";

// Listar todas as operações
export const listarOperacoes = async (req, res) => {
  try {
    const operacoes = await Operacoes.query();
    res.status(200).json(operacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar as operações." });
  }
};

// Criar uma nova operação
export const criarOperacao = async (req, res) => {
  const { OperacoesCEPPDescricao, EquipamentoOperacaoCicloPadrao } = req.body;

  try {
    const novaOperacao = await Operacoes.query().insert({
      OperacoesCEPPDescricao,
      EquipamentoOperacaoCicloPadrao,
    });
    res.status(201).json(novaOperacao);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a operação." });
  }
};

// Buscar uma operação por ID
export const buscarOperacaoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const operacao = await Operacoes.query().findById(id);
    if (operacao) {
      res.status(200).json(operacao);
    } else {
      res.status(404).json({ error: "Operação não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a operação." });
  }
};

// Atualizar uma operação
export const atualizarOperacao = async (req, res) => {
  const { id } = req.params;
  const { OperacoesCEPPDescricao, EquipamentoOperacaoCicloPadrao } = req.body;

  try {
    const operacaoAtualizada = await Operacoes.query()
      .findById(id)
      .patch({ OperacoesCEPPDescricao, EquipamentoOperacaoCicloPadrao });

    if (operacaoAtualizada) {
      res.status(200).json({ message: "Operação atualizada com sucesso." });
    } else {
      res.status(404).json({ error: "Operação não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a operação." });
  }
};

// Deletar uma operação
export const deletarOperacao = async (req, res) => {
  const { id } = req.params;

  try {
    const operacaoDeletada = await Operacoes.query().deleteById(id);

    if (operacaoDeletada) {
      res.status(200).json({ message: "Operação deletada com sucesso." });
    } else {
      res.status(404).json({ error: "Operação não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar a operação." });
  }
};
