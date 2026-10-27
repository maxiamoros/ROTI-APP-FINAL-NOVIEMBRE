const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'rotiapp_secreto_super_seguro_2026';

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body || {};
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Credenciales por defecto para admin (Choco / river91218)
    if (username.trim().toLowerCase() === 'choco' && password === 'river91218') {
      const token = jwt.sign(
        { id: 1, username: 'Choco', rol: 'ADMIN' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );
      return res.status(200).json({
        token,
        user: { id: 1, username: 'Choco', rol: 'ADMIN' }
      });
    }

    const user = await prisma.usuario.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      error: 'Error al procesar el inicio de sesión', 
      details: error.message || 'Error interno'
    });
  }
}

module.exports = handler;
module.exports.default = handler;
