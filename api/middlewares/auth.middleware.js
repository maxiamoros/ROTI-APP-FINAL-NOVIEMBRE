const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET no está configurado');
}

const JWT_SECRET = process.env.JWT_SECRET || 'rotiapp_dev_secret_solo_local';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.userRol !== 'ADMIN' && req.userRol !== 'GERENTE') {
    return res.status(403).json({ error: 'Require Admin Role' });
  }
  next();
};

module.exports = {
  JWT_SECRET,
  verifyToken,
  requireAdmin
};
