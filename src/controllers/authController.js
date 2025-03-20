import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const usuario = await Usuario.query().where('usuario', username).first();

    if (!usuario) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Senha: ", password)
    console.log("Senha Banco: ", usuario.senha)
    const isMatch = await bcrypt.compare(password, usuario.senha);

    console.log('isMatch: ', isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.usuario,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const { senha, ...user } = usuario;

    return res.json({ token, usuario: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  const { id } = req.query;
  try {
    if (!req.query) {
      return res.status(400).json({ message: 'Request with no params was sent.' });
    }
    const usuario = await Usuario.query().findById(Number(id));

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario não encontrado' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.name,
        usuario: usuario.usuario,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const resetPassword = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca o usuário pelo username
    const usuario = await Usuario.query().where('usuario', username).first();

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await Usuario.query().findById(usuario.id).patch({
      senha: password,
    });

    res.status(200).json({ message: 'Senha alterada com sucesso'});
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro no servidor ao alterar senha' });
  }
};