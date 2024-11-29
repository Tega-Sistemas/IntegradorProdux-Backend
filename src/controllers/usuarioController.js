import Usuario from '../models/Usuario.js';

// Listar todos os usuários
export async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.query();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

// Criar um novo usuário
export async function criarUsuario(req, res) {
  try {
    const novoUsuario = await Usuario.query().insert(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
}

// Buscar usuário por ID
export async function buscarUsuarioPorId(req, res) {
  try {
    const usuario = await Usuario.query().findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

// Atualizar um usuário
export async function atualizarUsuario(req, res) {
  try {
    const atualizado = await Usuario.query()
      .findById(req.params.id)
      .patch(req.body);
    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Deletar um usuário
export async function deletarUsuario(req, res) {
  try {
    const deletado = await Usuario.query().deleteById(req.params.id);
    if (!deletado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}
