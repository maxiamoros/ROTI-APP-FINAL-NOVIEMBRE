//
// Pedidos de cocina (KDS) — fuente de verdad: API /api/ventas
// localStorage queda solo como respaldo offline / transición.
//

const LS_KEY = 'rotiseria_pedidos_kds';

const ESTADOS_ACTIVOS = new Set(['nuevo', 'preparando', 'listo']);

/**
 * @typedef {Object} ItemPedido
 * @property {number} id
 * @property {string} nombre
 * @property {string} [emoji]
 * @property {number} cantidad
 * @property {number} precio
 */

/**
 * @typedef {'nuevo' | 'preparando' | 'listo' | 'entregado'} EstadoPedido
 *
 * @typedef {Object} PedidoKDS
 * @property {number}       id
 * @property {string}       numero
 * @property {string}       hora
 * @property {number}       timestamp
 * @property {ItemPedido[]} items
 * @property {number}       total
 * @property {string}       [metodo]
 * @property {EstadoPedido} estado
 * @property {string}       [nota]
 */

/** Normaliza un Pedido de la DB al formato que usa la UI del KDS */
export function mapPedidoAPIaKDS(pedido) {
  let items = [];
  try {
    items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : (pedido.items || []);
  } catch (_) {
    items = [];
  }

  const fecha = new Date(pedido.fecha);
  const ts = Number.isNaN(fecha.getTime()) ? Date.now() : fecha.getTime();

  // Pedidos viejos con estado "completado" no entran a cocina activa
  let estado = pedido.estado;
  if (!ESTADOS_ACTIVOS.has(estado) && estado !== 'entregado') {
    estado = 'nuevo';
  }

  return {
    id: pedido.id,
    numero: `#${String(pedido.id).padStart(3, '0')}`,
    hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: ts,
    items: items.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      emoji: i.emoji || '🍽️',
      cantidad: i.cantidad || 1,
      precio: i.precio || 0,
      imagenUrl: i.imagenUrl,
    })),
    total: pedido.total,
    metodo: pedido.metodo || 'venta',
    estado,
    nota: pedido.nota,
  };
}

/** Obtiene pedidos activos de cocina desde la API */
export async function fetchPedidosKDS(token) {
  const res = await fetch('/api/ventas?cocina=1', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudieron cargar los pedidos de cocina');
  const data = await res.json();
  return (Array.isArray(data) ? data : [])
    .filter((p) => ESTADOS_ACTIVOS.has(p.estado))
    .map(mapPedidoAPIaKDS)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/** Actualiza el estado de un pedido en la API */
export async function actualizarEstadoPedidoAPI(token, id, estado) {
  const res = await fetch(`/api/ventas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el pedido');
  return mapPedidoAPIaKDS(await res.json());
}

/** Lee la lista de pedidos KDS desde localStorage (respaldo) */
export function leerPedidosKDS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

/** Persiste la lista completa en localStorage (respaldo) */
export function guardarPedidosKDS(lista) {
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
}

/** Agrega un nuevo pedido (respaldo local; la fuente de verdad es la API) */
export function agregarPedidoKDS(pedido) {
  const lista = leerPedidosKDS();
  const numero = pedido.numero || `#${String(lista.length + 1).padStart(3, '0')}`;
  const nuevo = { ...pedido, numero, estado: pedido.estado || 'nuevo', inicioPrep: null, finPrep: null };
  const actualizada = [nuevo, ...lista];
  guardarPedidosKDS(actualizada);
  return nuevo;
}

/** Cambia el estado de un pedido en localStorage */
export function cambiarEstadoPedido(id, nuevoEstado) {
  const lista = leerPedidosKDS();
  const ahora = Date.now();
  const actualizada = lista.map((p) => {
    if (p.id !== id) return p;
    return {
      ...p,
      estado: nuevoEstado,
      inicioPrep: nuevoEstado === 'preparando' ? ahora : p.inicioPrep,
      finPrep: nuevoEstado === 'listo' ? ahora : p.finPrep,
    };
  });
  guardarPedidosKDS(actualizada);
  return actualizada;
}

/** Elimina pedidos listos del historial KDS local */
export function limpiarListos() {
  const lista = leerPedidosKDS().filter((p) => p.estado !== 'listo');
  guardarPedidosKDS(lista);
  return lista;
}
