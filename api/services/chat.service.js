const { spawn } = require('child_process');
const path = require('path');

/**
 * Servicio de Chat conectado a Python + LangChain + Gemini API.
 * Ejecuta el script backend/langchain_chat.py enviando el mensaje y el historial conversacional.
 */
const generateChatResponse = (mensaje, historial = []) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../backend/langchain_chat.py');
    const pythonExec = process.env.PYTHON_EXEC || 'python';

    const payload = JSON.stringify({
      mensaje,
      historial
    });

    const child = spawn(pythonExec, [pythonScript], {
      cwd: path.join(__dirname, '../..'),
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8'
      }
    });

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString('utf-8');
    });

    child.stderr.on('data', (chunk) => {
      stderrData += chunk.toString('utf-8');
    });

    child.on('error', (err) => {
      console.error('[Chat Service] Error al ejecutar proceso Python:', err);
      reject(new Error(`No se pudo ejecutar Python para LangChain: ${err.message}`));
    });

    child.on('close', (code) => {
      if (stderrData) {
        console.warn('[LangChain Python Log]:', stderrData.trim());
      }

      if (code !== 0 && !stdoutData.trim()) {
        console.error(`[Chat Service] Proceso Python falló con código ${code}`);
        return reject(new Error(`Error en el servicio Python LangChain (código ${code})`));
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        if (parsed.respuesta) {
          resolve(parsed.respuesta);
        } else if (parsed.error) {
          reject(new Error(parsed.error));
        } else {
          resolve(stdoutData.trim());
        }
      } catch (parseError) {
        // Si no es JSON puro, retornar el texto recibido
        if (stdoutData.trim()) {
          resolve(stdoutData.trim());
        } else {
          reject(new Error('Respuesta vacía o inválida del servicio LangChain'));
        }
      }
    });

    // Enviar el payload por stdin
    child.stdin.write(payload, 'utf-8');
    child.stdin.end();
  });
};

module.exports = {
  generateChatResponse
};
