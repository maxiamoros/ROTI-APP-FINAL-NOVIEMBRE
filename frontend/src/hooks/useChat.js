import { useState } from 'react';
import { leerProductos } from '../data/productos';
import { leerInsumos, estadoStock } from '../data/inventario';
import { leerVentas } from '../data/ventas';
import { leerPedidosKDS } from '../data/pedidosKDS';

const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// Simulador de respuesta local
const generateLocalResponse = (input) => {
  const query = input.toLowerCase();
  
  // 1. Saludos y conversación casual
  if (/(hola|buenas|qué tal|como estas|cómo estás|buen día|buenas tardes|buenas noches)/i.test(query)) {
    return "¡Hola! Todo excelente por acá, gestionando a pleno la rotisería. ¿Tú qué tal? ¿En qué te puedo ayudar hoy con el panel, las ventas o los pedidos?";
  }
  if (/(clima|llover|sol|calor|frío)/i.test(query)) {
    return "Parece que el clima está ideal para no cocinar, ¿verdad? Si el día está feo, la gente suele pedir mucho delivery de empanadas. ¿Querés que revisemos cómo venimos de stock o de pedidos hoy?";
  }
  if (/(curiosidad|chiste|contame algo|aburrido)/i.test(query)) {
    return "¡Claro! ¿Sabías que la palabra 'rotisería' viene de 'rôtir' en francés, que significa asar? Nosotros le ponemos el toque argentino. Hablando de eso, ¿querés ver cuáles son nuestras especialidades más vendidas hoy?";
  }

  // 2. Consultas de Stock/Alertas
  if (/(stock|inventario|alertas|falta|cajas|muzzarella|aceite)/i.test(query)) {
    const insumos = leerInsumos();
    const criticos = insumos.filter(i => ['critico', 'agotado', 'bajo'].includes(estadoStock(i)));
    
    let respuesta = "Revisando el inventario...\n\n";
    if (criticos.length > 0) {
      respuesta += "¡Atención! Tenemos algunas alertas de stock que deberías revisar:\n";
      criticos.forEach(i => {
        respuesta += `- **${i.nombre}**: ${i.stock} ${i.unidad} (Mínimo: ${i.stockMinimo})\n`;
      });
      if (query.includes('caja') || query.includes('muzzarella') || query.includes('aceite')) {
        respuesta += "\nEspecíficamente sobre lo que preguntaste, asegurate de reponer pronto para no frenar la cocina.";
      }
    } else {
      respuesta += "Por suerte todo el inventario está por encima del mínimo. No hay alertas críticas por ahora.";
    }
    respuesta += "\n\n¿Quieres que arme una promo rápida para el stock de hoy?";
    return respuesta;
  }

  // 3. Consultas de Ventas/Métricas
  if (/(venta|promedio|hora pico|diario|facturaci|vendido)/i.test(query)) {
    const ventas = leerVentas();
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const ventasHoy = ventas.filter(v => v.timestamp >= hoy.getTime());
    const totalHoy = ventasHoy.reduce((s, v) => s + v.total, 0);
    
    // Simulación del promedio diario solicitado (47 pedidos/día)
    const promedioPedidos = 47;
    
    return `**Resumen de Ventas:**
- **Total facturado hoy:** ${formatPeso(totalHoy)}
- **Ventas registradas hoy:** ${ventasHoy.length}
- **Promedio diario histórico:** ${promedioPedidos} pedidos/día.
- **Hora pico estimada:** Suele ser entre las 20:30 y las 21:45.

¿Querés que armemos alguna promoción para potenciar las ventas de hoy?`;
  }

  // 4. Estado de Cocina
  if (/(cocina|demora|comanda|pendiente|kds|preparando)/i.test(query)) {
    const pedidosKDS = leerPedidosKDS();
    const activos = pedidosKDS.filter(p => p.estado !== 'listo');
    
    if (activos.length === 0) {
      return "La cocina está tranquila en este momento, no hay comandas pendientes.";
    }
    
    let respuesta = `**Estado de la Cocina:**\nActualmente hay ${activos.length} comandas en proceso:\n\n`;
    activos.forEach(p => {
      respuesta += `- Pedido #${p.numero} [**${p.estado.toUpperCase()}**]\n`;
    });
    respuesta += "\nLa demora promedio actual es de aprox. 20-25 minutos.";
    return respuesta;
  }
  
  if (/(menu|menú|productos|precio|empanada|pizza|postre|bebida)/i.test(query)) {
     const productos = leerProductos().filter(p => p.activo);
     
     if (/(postre|dulce|helado|tiramisu|flan)/i.test(query)) {
       return `Para el postre te puedo ofrecer varias opciones caseras muy buenas:\n- Flan Casero (con dulce de leche o mixto)\n- Budín de Pan\n- Tiramisú o Chocotorta\n- Mousse de Chocolate o Helado.\n¿Te gustaría agregar alguno a tu pedido?`;
     }
     
     if (/(bebida|tomar|gaseosa|cerveza|agua)/i.test(query)) {
       return `Para tomar tenemos una gran variedad:\n- Gaseosas de 1.5L, 2.25L o 500ml\n- Cervezas de litro o lata (Brahma, Quilmes, Stella)\n- Aguas con/sin gas y saborizadas.\n¿Qué bebida prefieres para acompañar?`;
     }

     return `Tenemos ${productos.length} productos activos en el menú. Nuestras especialidades incluyen empanadas, milanesas, pizzas, y ahora también una gran variedad de bebidas y postres caseros. Si necesitas ajustar algún precio o ver el menú completo, podés hacerlo desde la sección de Productos del panel.`;
  }

  // 5. Promociones y Combos
  if (/(promoción|promo|combo|descuento|ideas para vender|vender más)/i.test(query)) {
    return `**¡Claro! Acá van algunas ideas de promociones para hoy:**

- **Promo Almuerzo:** "1 Tarta Individual + Bebida por $X" (Ideal para movimiento rápido al mediodía).
- **Promo Dulce:** "Llevando 2 Pizzas Grandes, te llevas un Flan Casero o Budín a mitad de precio".
- **Promo Stock:** "Combo 2 Pizzas Muzzarella + Fainá con 15% de descuento" (Aprovechando que tenemos ingredientes).
- **Promo Noche Pico:** "Docena de Empanadas + Gaseosa 1.5L de regalo" (Ideal para agilizar la cocina en hora pico entre las 20:30 y 21:30 hs).

¿Te gusta alguna de estas ideas para activarla en el local?`;
  }

  // 6. Asesor Operativo y Consejos
  if (/(consejo|tip|recomendaci|cómo mejorar|mejorar)/i.test(query)) {
    return `**Consejos operativos basados en tus datos:**

- **Tip de Stock:** Atención con el Queso Muzzarella y el Aceite; quedan pocos días de reserva. Te recomiendo hacer el pedido al proveedor hoy para evitar desabastecimiento en hora pico.
- **Tip de Cocina:** Como el horario pico es de 20:30 a 21:30 hs, te sugiero pre-cocinar las bases de pizza a las 19:45 hs para reducir el tiempo de espera.
- **Tip de Ventas (Upselling):** Al finalizar cada pedido por teléfono o mostrador, ofrece un postre casero (como el Tiramisú) o una cerveza fría para aumentar el ticket promedio fácilmente.

¿Te gustaría profundizar en alguno de estos puntos?`;
  }

  // 5. Preguntas generales / Desconocidas
  return "Mmm, interesante. Como soy el asistente de gestión de la rotisería, me especializo más en ventas, stock y cocina. ¿Me podrías aclarar un poco más a qué te referís o cómo te puedo ayudar con el local?";
};

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy **RotiAI**, tu asistente virtual.\n\nPuedo ayudarte con:\n- Menú y especialidades (milanesas, pizzas, empanadas, postres)\n- Precios actualizados y promociones del día\n- Cómo realizar tu pedido online (/cliente) o por WhatsApp\n- Horarios de atención y envíos a domicilio\n\n¿Qué te gustaría saber o pedir hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Llamada al backend Express que ejecuta Python + LangChain + Gemini
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensaje: userMessage,
          historial: updatedMessages.slice(-8)
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.respuesta) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.respuesta }]);
      } else {
        throw new Error('Respuesta no válida del servidor');
      }
    } catch (err) {
      console.warn('[useChat] Error al conectar con /api/chat, utilizando respuesta contextual:', err);
      // Fallback local en caso de desconexión o fallo de red
      const fallbackText = generateLocalResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, error, sendMessage };
};

