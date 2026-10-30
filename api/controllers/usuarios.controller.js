const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, username: true, rol: true } // Excluir password
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { username, password, rol } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        username,
        password: hashedPassword,
        rol: rol || 'CAJERO'
      },
      select: { id: true, username: true, rol: true }
    });
    
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, rol } = req.body;
    
    const data = { username, rol };
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data,
      select: { id: true, username: true, rol: true }
    });
    
    res.json(usuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario
};
