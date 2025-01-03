import Agenda from "../models/Agenda.js";
import Log from "../models/Log.js";

export const listarAgendas = async (req, res) => {
  try {
    const { tipo } = req.query;

    let agendas;

    if (tipo > 0) {
      agendas = await Agenda.query().where('tipo', tipo);
    } else {
      agendas = await Agenda.query();
    }

    res.status(200).json(agendas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar as agendas." });
  }
};

export const criarAgenda = async (req, res) => {
  try {
    const { Horario, Tipo, UsuarioCriacao, UsuarioAlteracao } = req.body;

    if (![1, 2].includes(Tipo)) {
      return res.status(400).json({ error: "Tipo inválido. Use 1 para Extração ou 2 para Envio ao ERP." });
    }

    const novaAgenda = await Agenda.query().insert({
      Horario,
      Tipo,
      UsuarioCriacao,
      UsuarioAlteracao,
    });

    res.status(201).json(novaAgenda);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a agenda." });
  }
};

export const atualizarAgenda = async (req, res) => {
  const { id } = req.params;
  const { Horario, Tipo, UsuarioAlteracao } = req.body;

  try {
    const agendaAtualizada = await Agenda.query()
      .findById(id)
      .patch({
        Horario,
        Tipo,
        AlteradoEm: new Date().toISOString(),
        UsuarioAlteracao,
      });

    if (agendaAtualizada) {
      res.status(200).json({ message: "Agenda atualizada com sucesso." });
    } else {
      res.status(404).json({ error: "Agenda não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a agenda.", msg: error });
  }
};

export const deletarAgenda = async (req, res) => {
  const { id } = req.params;

  try {
    const agendaDeletada = await Agenda.query().deleteById(id);

    if (agendaDeletada) {
      res.status(200).json({ message: "Agenda deletada com sucesso." });
    } else {
      res.status(404).json({ error: "Agenda não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar a agenda." });
  }
};
