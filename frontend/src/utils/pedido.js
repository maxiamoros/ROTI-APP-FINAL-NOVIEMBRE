// ─────────────────────────────────────────────────────────────────────────────
// Utilidades del cierre de pedido (Portal Cliente / "Hacé tu pedido")
//
// Todos los datos del pedido viven en UN solo objeto `pedido`. Ese mismo objeto
// se reutiliza para: el ticket en pantalla, el ticket impreso, la descarga .txt
// y el mensaje de WhatsApp. Así nunca quedan desincronizados.
// ─────────────────────────────────────────────────────────────────────────────

/** WhatsApp del local en formato internacional de Argentina (54 + 9 + área + número). */
export const WHATSAPP_NUMERO = '5492604406018';

/** Nombre que se imprime en el encabezado del ticket y del mensaje. */
export const NOMBRE_LOCAL = 'ROTISERIA ANTI';

/** Método de pago que se muestra en los pedidos de delivery. */
export const PAGO_DELIVERY = 'A coordinar por WhatsApp';

/** Modalidades disponibles al finalizar el pedido. */
export const MODALIDADES = {
  local: {
    id: 'local',
    label: 'Comer en el local',
    emoji: '🍽️',
    desc: 'Disfrutalo acá, recién hecho',
    notaTicket: 'Te avisamos cuando esté listo',
  },
  llevar: {
    id: 'llevar',
    label: 'Para llevar / retirar',
    emoji: '🛍️',
    desc: 'Lo retirás por mostrador',
    notaTicket: 'Retirá por mostrador',
  },
  delivery: {
    id: 'delivery',
    label: 'Delivery',
    emoji: '🛵',
    desc: 'Te lo llevamos a tu casa',
    notaTicket: 'Te lo llevamos a domicilio',
  },
};

/** Formatea un número como pesos argentinos: "$20.000" (separador de miles con punto, sin decimales). */
export const formatPeso = (n) =>
  '$' + Math.round(Number(n) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });

/** Devuelve fecha y hora legibles (es-AR) a partir de un ISO. Si no hay fecha, usa "ahora". */
export function formatFechaHora(iso) {
  const d = iso ? new Date(iso) : new Date();
  return {
    fecha: d.toLocaleDateString('es-AR'),
    hora: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Crea el objeto `pedido` a partir del carrito y la modalidad elegida.
 * Hace una "foto" del carrito para que el ticket no cambie aunque el carrito se modifique.
 */
export function crearPedido(carrito, modalidad) {
  const items = (Array.isArray(carrito) ? carrito : []).map((i) => {
    const cantidad = Number(i?.cantidad) || 1;
    const precio = Number(i?.precio) || 0;
    return {
      id: i?.id,
      nombre: i?.nombre || 'Producto',
      opcion: i?.opcion || '',
      medallones: i?.medallones || null,
      medallonesTexto: i?.medallonesTexto || '',
      costoMedallonesExtra: Number(i?.costoMedallonesExtra) || 0,
      sinIngredientes: Array.isArray(i?.sinIngredientes) ? i.sinIngredientes : [],
      sinTexto: i?.sinTexto || '',
      acompanamiento: i?.acompanamiento || null,
      bebida: i?.bebida || null,
      aclaracion: i?.aclaracion || '',
      cantidad,
      precio,
      subtotal: cantidad * precio,
      imagenUrl: i?.imagenUrl,
    };
  });

  return {
    numero: Math.floor(Math.random() * 900) + 100,
    modalidad,
    items,
    total: items.reduce((s, i) => s + i.subtotal, 0),
    metodoPago: null,
    cliente: null,
    fecha: null,
  };
}

/** Formatea el detalle de un ítem para el mensaje de WhatsApp */
export function formatearItemWhatsApp(i) {
  const lineas = [`• ${i.cantidad}x *${i.nombre}* - ${formatPeso(i.subtotal)}`];
  if (i.medallonesTexto) {
    lineas.push(`    ↳ ${i.medallonesTexto}`);
  }
  if (i.opcion) {
    lineas.push(`    ↳ Opción: ${i.opcion}`);
  }
  if (i.sinTexto) {
    lineas.push(`    ↳ ${i.sinTexto}`);
  }
  if (i.acompanamiento) {
    const acompNom = typeof i.acompanamiento === 'string' ? i.acompanamiento : i.acompanamiento.nombre;
    lineas.push(`    ↳ Acompañamiento: ${acompNom}`);
  }
  if (i.bebida) {
    let bebNom = '';
    if (typeof i.bebida === 'string') {
      bebNom = i.bebida;
    } else {
      const partes = [i.bebida.nombre];
      if (i.bebida.tamano) partes.push(i.bebida.tamano);
      if (i.bebida.hielo) partes.push(`(${i.bebida.hielo})`);
      bebNom = partes.join(' ');
    }
    lineas.push(`    ↳ Bebida: ${bebNom}`);
  }
  if (i.aclaracion && !i.sinTexto && !i.acompanamiento && !i.bebida) {
    lineas.push(`    ↳ Nota: ${i.aclaracion}`);
  }
  return lineas.join('\n');
}

// ─── Validación del formulario de delivery ───────────────────────────────────

/**
 * Valida los datos de entrega. Devuelve un objeto { campo: 'mensaje' } con los errores.
 * Si el objeto está vacío, los datos son válidos.
 */
export function validarDatosDelivery({ nombre = '', calle = '', numero = '', telefono = '' }) {
  const errores = {};

  if (!nombre.trim()) errores.nombre = 'Ingresá tu nombre completo.';
  if (!calle.trim()) errores.calle = 'Ingresá la calle.';
  if (!numero.trim()) errores.numero = 'Ingresá el número de casa.';

  const tel = telefono.trim();
  if (!tel) {
    errores.telefono = 'Ingresá tu número de teléfono.';
  } else if (!/^\d+$/.test(tel)) {
    errores.telefono = 'El teléfono solo puede tener números (sin espacios, guiones ni "+").';
  }

  return errores;
}

// ─── WhatsApp ────────────────────────────────────────────────────────────────

/** Arma el texto (sin codificar) del mensaje de WhatsApp para un pedido de delivery. */
export function armarMensajeWhatsApp(pedido) {
  const c = pedido.cliente || {};
  const lineas = [
    `*NUEVO PEDIDO #${pedido.numero} - ${NOMBRE_LOCAL}*`,
    '',
    `*Modalidad:* ${MODALIDADES[pedido.modalidad]?.label || pedido.modalidad}`,
    '',
    '*Detalle del pedido:*',
    ...pedido.items.map(formatearItemWhatsApp),
    '',
    `*Total: ${formatPeso(pedido.total)}*`,
    '',
    '*Datos de entrega:*',
    `Nombre: ${c.nombre || '-'}`,
    `Calle: ${c.calle || '-'}`,
    `Número: ${c.numero || '-'}`,
    `Teléfono: ${c.telefono || '-'}`,
  ];
  if (c.mapaUrl) {
    lineas.push(`📍 Ubicación GPS: ${c.mapaUrl}`);
  }
  return lineas.join('\n');
}

/** URL de wa.me con el mensaje ya codificado (encodeURIComponent). */
export const urlWhatsApp = (pedido) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(armarMensajeWhatsApp(pedido))}`;

// ─── Ticket en texto plano (descarga) ────────────────────────────────────────

const ANCHO_TICKET = 40;
const separador = (c = '-') => c.repeat(ANCHO_TICKET);
const centrar = (t = '') => ' '.repeat(Math.max(0, Math.floor((ANCHO_TICKET - t.length) / 2))) + t;
/** Texto a la izquierda y monto a la derecha; si no entra, el monto pasa a la línea siguiente. */
const fila = (izq, der) => {
  const espacio = ANCHO_TICKET - izq.length - der.length;
  return espacio >= 1 ? izq + ' '.repeat(espacio) + der : `${izq}\n${der.padStart(ANCHO_TICKET)}`;
};

/** Genera el ticket en texto plano (mismo contenido que el ticket en pantalla). */
export function armarTextoTicket(pedido) {
  const { fecha, hora } = formatFechaHora(pedido.fecha);
  const modalidad = MODALIDADES[pedido.modalidad];

  const l = [
    separador('='),
    centrar(NOMBRE_LOCAL),
    separador('='),
    `Pedido #${pedido.numero}`,
    `Fecha: ${fecha}   Hora: ${hora}`,
    `Modalidad: ${modalidad?.label || pedido.modalidad}`,
  ];
  if (pedido.metodoPago) l.push(`Pago: ${pedido.metodoPago}`);
  l.push(separador());

  pedido.items.forEach((i) => {
    l.push(fila(`${i.cantidad}x ${i.nombre}`, formatPeso(i.subtotal)));
    if (i.cantidad > 1) l.push(`   ${formatPeso(i.precio)} c/u`);
    if (i.medallonesTexto) l.push(`   * ${i.medallonesTexto}`);
    if (i.opcion) l.push(`   * Opción: ${i.opcion}`);
    if (i.sinTexto) l.push(`   * ${i.sinTexto}`);
    if (i.acompanamiento) {
      const acompNom = typeof i.acompanamiento === 'string' ? i.acompanamiento : i.acompanamiento.nombre;
      l.push(`   * Acomp: ${acompNom}`);
    }
    if (i.bebida) {
      let bebNom = '';
      if (typeof i.bebida === 'string') {
        bebNom = i.bebida;
      } else {
        const partes = [i.bebida.nombre];
        if (i.bebida.tamano) partes.push(i.bebida.tamano);
        if (i.bebida.hielo) partes.push(`(${i.bebida.hielo})`);
        bebNom = partes.join(' ');
      }
      l.push(`   * Bebida: ${bebNom}`);
    }
    if (i.aclaracion && !i.sinTexto && !i.acompanamiento && !i.bebida) {
      l.push(`   * Nota: ${i.aclaracion}`);
    }
  });

  l.push(separador(), fila('TOTAL', formatPeso(pedido.total)), separador());

  if (pedido.cliente) {
    const c = pedido.cliente;
    l.push('DATOS DE ENTREGA', `Nombre: ${c.nombre}`, `Dirección: ${c.calle} ${c.numero}`, `Teléfono: ${c.telefono}`);
    if (c.mapaUrl) {
      l.push(`Ubicación GPS: ${c.mapaUrl}`);
    }
    l.push(separador());
  }

  l.push(centrar('¡GRACIAS POR TU COMPRA!'), centrar(modalidad?.notaTicket || ''));
  return l.join('\n');
}

/** Descarga el ticket como archivo .txt (funciona en celular y PC, sin librerías extra). */
export function descargarTicket(pedido) {
  // El BOM (\uFEFF) asegura que tildes y "ñ" se vean bien en cualquier editor
  const blob = new Blob(['\uFEFF' + armarTextoTicket(pedido)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket-pedido-${pedido.numero}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
