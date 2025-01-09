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

    const isMatch = await bcrypt.compare(password, usuario.senha);
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
        expiresIn: '1h'
      }
    );

    const { senha, ...user } = usuario;

    return res.json({ token, usuario: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMe = async (req, res) => {
  const { id } = req.query;
  try {
    if (!req.query) {
      return res.status(400).json({ message: 'Request with no params was sent.' });
    }
    // Assuming 'req.user' contains user data after decoding the JWT token
    const usuario = await Usuario.query().findById(Number(id));

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario não encontrado' });
    }

    // Return the user data (only what should be accessible from the auth layer)
    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.name,
        usuario: usuario.usuario,
        email: usuario.email,
        role: usuario.role,
        // Include additional fields if necessary
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
