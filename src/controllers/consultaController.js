import Consulta from '../models/Consulta.js';
import { validarComandoSql } from '../utils/validarSql.js'; // Importa a função

export const listarConsultas = async (req, res) => {
  try {
    const consultaList = await Consulta.query().select().orderBy('nome_tabela');
    res.status(200).json(consultaList);
  } catch (error) {
    console.error('Erro ao listar Consultas:', error);
    res.status(500).json({ error: 'Erro ao listar Consultas' });
  }
};

export const criarConsulta = async (req, res) => {
  try {
    const {
      nome_tabela,
      nome_modelo,
      nome_arquivo,
      comando_sql,
      usuario_criacao,
      usuario_alteracao,
      filtros_colunas,
      formatar_valores,
      update_on_duplicate,
      expandir_ordem,
      colunas_duplicidade,
    } = req.body;

    // Usa a função importada
    if (!validarComandoSql(comando_sql)) {
      return res.status(400).json({ error: 'Comando SQL inválido. Apenas consultas SELECT são permitidas.' });
    }

    const novaConsulta = await Consulta.query().insert({
      nome_tabela,
      nome_modelo,
      nome_arquivo,
      comando_sql,
      usuario_criacao,
      usuario_alteracao,
      filtros_colunas: filtros_colunas ? JSON.stringify(filtros_colunas) : '',
      formatar_valores: formatar_valores ? JSON.stringify(formatar_valores) : '',
      update_on_duplicate: update_on_duplicate,
      expandir_ordem: expandir_ordem ? JSON.stringify(expandir_ordem) : '',
      colunas_duplicidade: colunas_duplicidade ? JSON.stringify(colunas_duplicidade) : '',
    });

    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error('Erro ao inserir Consulta:', error);
    res.status(500).json({ error: 'Erro ao inserir Consulta' });
  }
};

export const updateConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_tabela,
      nome_modelo,
      nome_arquivo,
      comando_sql,
      usuario_alteracao,
      filtros_colunas,
      formatar_valores,
      update_on_duplicate,
      expandir_ordem,
      colunas_duplicidade,
    } = req.body;

    const consulta = await Consulta.query().findById(id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    // Usa a função importada
    if (!validarComandoSql(comando_sql)) {
      return res.status(400).json({ error: 'Comando SQL inválido. Apenas consultas SELECT são permitidas.' });
    }

    const consultaAtualizada = await Consulta.query()
      .findById(id)
      .patch({
        nome_tabela,
        nome_modelo,
        nome_arquivo,
        comando_sql,
        usuario_alteracao,
        filtros_colunas: filtros_colunas ? JSON.stringify(filtros_colunas) : '',
        formatar_valores: formatar_valores ? JSON.stringify(formatar_valores) : '',
        update_on_duplicate: update_on_duplicate,
        expandir_ordem: expandir_ordem ? JSON.stringify(expandir_ordem) : '',
        colunas_duplicidade: colunas_duplicidade ? JSON.stringify(colunas_duplicidade) : '',
      });

    if (!consultaAtualizada) {
      return res.status(400).json({ message: 'Erro ao atualizar Consulta' });
    }

    res.status(200).json({
      message: 'Consulta atualizada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao atualizar Consulta:', error);
    res.status(500).json({ error: 'Erro ao atualizar Consulta' });
  }
};