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
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    return res.json({ token, username: usuario.usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' })
  }
}
