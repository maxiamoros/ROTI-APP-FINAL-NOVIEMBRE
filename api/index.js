require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Load routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/config', require('./routes/config.routes'));
app.use('/api/insumos', require('./routes/insumos.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));

app.get('/api', (req, res) => {
  res.status(200).json({ status: "API Root OK", method: req.method });
});

// Start server if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}

module.exports = app;
