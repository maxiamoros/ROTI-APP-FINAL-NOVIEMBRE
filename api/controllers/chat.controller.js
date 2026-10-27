const { generateChatResponse } = require('../services/chat.service');

const chatWithIA = async (req, res) => {
  try {
    const { mensaje, historial } = req.body;
    
    if (!mensaje) {
      return res.status(400).json({ error: 'El campo "mensaje" es requerido.' });
    }

    const respuesta = await generateChatResponse(mensaje, historial);
    res.json({ respuesta });
  } catch (error) {
    console.error('Error en el chat:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  chatWithIA
};
