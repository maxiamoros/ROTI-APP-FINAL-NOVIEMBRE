const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    const user = await prisma.usuario.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
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
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Credential is required' });

    // Sin Client ID no se puede verificar la firma del token: aceptarlo permitiría falsificar cualquier email
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'TU_GOOGLE_CLIENT_ID') {
      return res.status(503).json({ error: 'El login con Google no está configurado en el servidor' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(400).json({ error: 'No se pudo obtener el correo de Google' });
    }

    const email = payload.email.toLowerCase();

    // Verify if email is in whitelist
    const configWhitelist = await prisma.configuracion.findUnique({
      where: { clave: 'WHITELIST_EMAILS' }
    });
    
    let allowedEmails = ['maxiamoros123@gmail.com'];
    if (configWhitelist && configWhitelist.valor) {
      allowedEmails = configWhitelist.valor.split(',').map(e => e.trim().toLowerCase());
    } else {
      // Initialize whitelist if it doesn't exist
      await prisma.configuracion.create({
        data: {
          clave: 'WHITELIST_EMAILS',
          valor: 'maxiamoros123@gmail.com'
        }
      });
    }

    if (!allowedEmails.includes(email)) {
      return res.status(403).json({ error: 'Tu correo no está autorizado para acceder al panel.' });
    }

    let user = await prisma.usuario.findUnique({
      where: { username: email }
    });

    if (!user) {
      user = await prisma.usuario.create({
        data: {
          username: email,
          password: 'GOOGLE_AUTH_USER', // Fake password for OAuth users
          rol: 'ADMIN' // Default to ADMIN for Google users
        }
      });
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
    console.error('Error en google login:', error);
    return res.status(401).json({ error: 'Error al verificar la cuenta de Google' });
  }
};

const logout = (req, res) => {
  return res.status(200).json({ message: 'Logout exitoso' });
};

module.exports = {
  login,
  googleLogin,
  logout
};
