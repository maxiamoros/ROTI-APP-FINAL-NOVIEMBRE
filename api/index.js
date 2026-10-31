require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Swagger / OpenAPI docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'RotiApp API Docs',
  swaggerOptions: { persistAuthorization: true },
}));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

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
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
