import Usuario from '../models/Usuario.js';

// Listar todos os usuários
export async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.query();
    const usuariosTratados = usuarios.map(({ senha, ...resto}) => resto);
    res.json(usuariosTratados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

// Criar um novo usuário
export async function criarUsuario(req, res) {
  try {
    const { usuario, email } = req.body;
    let usuarioExiste = {};
    usuarioExiste = await Usuario.query().where('usuario', usuario).orWhere('email', email).first();
  
    if (!usuarioExiste) {
      const novoUsuario = await Usuario.query().insert(req.body);
      res.status(201).json(novoUsuario);
    } else {
      res.status(400).json(`O usuário '${usuario}' ou email '${email}' informados, já existem no sistema.`);
    }
    
  } catch (error) {
    console.error(error);
    res.status(400).json(`Erro ao criar usuário.`);
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
    const { email } = req.body;
    const { id } = req.params;

    let usuarioExiste = {};

    usuarioExiste = await Usuario.query().findById(id);
  
    if (!usuarioExiste) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userUK = await Usuario.query().where('email', email).andWhereNot('id', id).first();

    if (userUK) {
      return res.status(400).json({
        error: 'E-mail já está sendo utilizado por outro usuário!'
      })
    }

    const usuario = await Usuario.query().findById(id).patch(req.body);

    if (!usuario) {
      res.status(400).json({
        message: 'Ocorreram erros ao atualizar o usuário.'
      })
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
