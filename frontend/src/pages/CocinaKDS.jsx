import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchPedidosKDS,
  actualizarEstadoPedidoAPI,
  leerPedidosKDS,
} from '../data/pedidosKDS';

//
// HELPERS
//
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

/** Devuelve segundos transcurridos desde un timestamp */
const segundosDesde = (ts) => Math.floor((Date.now() - ts) / 1000);

/** Formatea segundos como "mm:ss" */
const formatTiempo = (seg) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Devuelve clase de color según urgencia */
const urgenciaClasses = (seg, estado) => {
  if (estado === 'listo') return {
    border: 'border-emerald-500/50',
    header: 'bg-emerald-900/30',
    badge:  'bg-roti-success/20 text-emerald-300 border-emerald-500/30',
    timer:  'text-emerald-400',
    glow:   '',
  };
  if (estado === 'preparando') {
    if (seg > 600) return { // > 10 min en prep
      border: 'border-red-500/70',
      header: 'bg-red-900/30',
      badge:  'bg-roti-primary/20 text-red-300 border-red-500/30',
      timer:  'text-red-400',
      glow:   'shadow-lg shadow-red-900/40',
    };
    return {
      border: 'border-amber-500/50',
      header: 'bg-amber-900/20',
      badge:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
      timer:  'text-amber-400',
      glow:   '',
    };
  }
  // nuevo
  if (seg > 300) return { // > 5 min esperando
    border: 'border-red-500/70',
    header: 'bg-red-900/30',
    badge:  'bg-roti-primary/20 text-red-300 border-red-500/30',
    timer:  'text-red-400',
    glow:   'shadow-lg shadow-red-900/40 animate-pulse',
  };
  return {
    border: 'border-blue-500/40',
    header: 'bg-blue-900/20',
    badge:  'bg-roti-secondary/20 text-blue-300 border-blue-500/30',
    timer:  'text-blue-400',
    glow:   '',
  };
};

/** Toca un beep via Web Audio API */
const beep = (freq = 880, duracion = 0.15, volumen = 0.3) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(volumen, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duracion);
  } catch (_) {}
};

//
// COMPONENTE: Timer en vivo
//
const Timer = ({ timestamp, estado, clases }) => {
  const [seg, setSeg] = useState(() => segundosDesde(timestamp));

  useEffect(() => {
    if (estado === 'listo') return;
    const interval = setInterval(() => setSeg(segundosDesde(timestamp)), 1000);
    return () => clearInterval(interval);
  }, [timestamp, estado]);

  return (
    <span className={`font-mono text-sm font-bold tabular-nums ${clases.timer}`}>
      {formatTiempo(seg)}
    </span>
  );
};

//
// COMPONENTE: Tarjeta de pedido
//
const ESTADO_CONFIG = {
  nuevo:      { label: 'Nuevo',       icon: '', next: 'preparando', nextLabel: 'Iniciar preparación' },
  preparando: { label: 'Preparando', icon: '', next: 'listo',      nextLabel: 'Marcar como listo'   },
  listo:      { label: 'Listo',      icon: '', next: null,         nextLabel: null                  },
};

const TarjetaPedido = ({ pedido, onCambiarEstado, onEliminar }) => {
  const cfg      = ESTADO_CONFIG[pedido.estado] || ESTADO_CONFIG.nuevo;
  const segDesde = segundosDesde(pedido.timestamp);
  const clases   = urgenciaClasses(segDesde, pedido.estado);

  return (
    <div className={`flex flex-col bg-[#3A4A51] rounded-2xl border ${clases.border} ${clases.glow}
                     overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div className={`${clases.header} px-4 py-3 flex items-center justify-between border-b border-white/5`}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-roti-cream tracking-tight">{pedido.numero}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${clases.badge}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Timer timestamp={pedido.timestamp} estado={pedido.estado} clases={clases} />
          <span className="text-xs text-roti-cream/50">{pedido.hora}</span>
        </div>
      </div>

      {/* Ítems */}
      <div className="flex-1 p-4 space-y-2">
        {pedido.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-xl flex-shrink-0">{item.emoji}</span>
            <span className="flex-1 text-sm font-medium text-roti-cream">{item.nombre}</span>
            <span className={`text-base font-black px-2 py-0.5 rounded-lg ${
              pedido.estado === 'listo'
                ? 'bg-emerald-900/30 text-emerald-400'
                : 'bg-[#4A5E68] text-roti-cream'
            }`}>
              ×{item.cantidad}
            </span>
          </div>
        ))}
        {pedido.nota && (
          <p className="text-xs text-amber-300/80 mt-2 leading-snug">{pedido.nota}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between gap-2">
        <span className="text-xs text-roti-cream/50">
          {pedido.items.reduce((s, i) => s + i.cantidad, 0)} ítem{pedido.items.reduce((s, i) => s + i.cantidad, 0) !== 1 ? 's' : ''}
          {' · '}{formatPeso(pedido.total)}
        </span>

        <div className="flex items-center gap-2">
          {pedido.estado === 'listo' && (
            <button
              onClick={() => onEliminar(pedido.id)}
              className="text-xs text-roti-cream/50 hover:text-red-400 transition-colors px-2 py-1 rounded-lg
                         hover:bg-roti-primary/10"
            >
              Quitar
            </button>
          )}
          {cfg.next && (
            <button
              onClick={() => onCambiarEstado(pedido.id, cfg.next)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95 ${
                pedido.estado === 'nuevo'
                  ? 'bg-amber-500 hover:bg-amber-400 text-roti-cream'
                  : 'bg-roti-success hover:bg-roti-success text-roti-cream'
              }`}
            >
              {cfg.nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

//
// PÁGINA PRINCIPAL: Cocina KDS
//
const CocinaKDS = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState(() => leerPedidosKDS());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('activos'); // 'activos' | 'todos' | 'listos'
  const [columnas, setColumnas] = useState(3); // 2 | 3 | 4
  const prevCountRef = useRef(0);

  const sincronizar = useCallback(async () => {
    if (!token) return;
    try {
      const nuevos = await fetchPedidosKDS(token);
      setPedidos(nuevos);
      setError(null);

      const countNuevos = nuevos.filter((p) => p.estado === 'nuevo').length;
      if (sonidoActivo && countNuevos > prevCountRef.current) {
        beep(880, 0.1);
        setTimeout(() => beep(1100, 0.15), 120);
      }
      prevCountRef.current = countNuevos;
    } catch (e) {
      console.error('[CocinaKDS]', e);
      setError(e.message || 'Error al sincronizar');
    } finally {
      setCargando(false);
    }
  }, [token, sonidoActivo]);

  // Polling de la API cada 2 segundos
  useEffect(() => {
    sincronizar();
    const interval = setInterval(sincronizar, 2000);
    return () => clearInterval(interval);
  }, [sincronizar]);

  const handleCambiarEstado = useCallback(async (id, nuevoEstado) => {
    if (!token) return;
    // Optimistic UI
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    try {
      await actualizarEstadoPedidoAPI(token, id, nuevoEstado);
      if (nuevoEstado === 'listo' && sonidoActivo) {
        beep(660, 0.08);
        setTimeout(() => beep(880, 0.12), 100);
        setTimeout(() => beep(1100, 0.2), 200);
      }
      await sincronizar();
    } catch (e) {
      console.error(e);
      await sincronizar();
      alert('No se pudo actualizar el estado del pedido');
    }
  }, [token, sonidoActivo, sincronizar]);

  const handleEliminar = useCallback(async (id) => {
    if (!token) return;
    setPedidos((prev) => prev.filter((p) => p.id !== id));
    try {
      await actualizarEstadoPedidoAPI(token, id, 'entregado');
      await sincronizar();
    } catch (e) {
      console.error(e);
      await sincronizar();
      alert('No se pudo quitar el pedido');
    }
  }, [token, sincronizar]);

  const handleLimpiarListos = useCallback(async () => {
    if (!token) return;
    const listos = pedidos.filter((p) => p.estado === 'listo');
    setPedidos((prev) => prev.filter((p) => p.estado !== 'listo'));
    try {
      await Promise.all(listos.map((p) => actualizarEstadoPedidoAPI(token, p.id, 'entregado')));
      await sincronizar();
    } catch (e) {
      console.error(e);
      await sincronizar();
    }
  }, [token, pedidos, sincronizar]);

  // Pedidos filtrados
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado === 'activos') return p.estado !== 'listo';
    if (filtroEstado === 'listos')  return p.estado === 'listo';
    return true;
  });

  // Stats
  const stats = {
    nuevos:     pedidos.filter((p) => p.estado === 'nuevo').length,
    preparando: pedidos.filter((p) => p.estado === 'preparando').length,
    listos:     pedidos.filter((p) => p.estado === 'listo').length,
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  }[columnas];

  // Reloj en vivo
  const [horaActual, setHoraActual] = useState(
    new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const t = setInterval(() =>
      setHoraActual(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden bg-slate-950">

      {/* HEADER */}
      <div className="bg-roti-dark border-b border-[#3A4A51] px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Título + reloj */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg"></span>
              </div>
              <div>
                <h1 className="text-base font-bold text-roti-cream leading-tight">Cocina  KDS</h1>
                <p className="text-xs text-roti-cream/50 font-mono">{horaActual}</p>
              </div>
            </div>

            {/* Stats en vivo */}
            <div className="hidden sm:flex items-center gap-2">
              {stats.nuevos > 0 && (
                <span className="flex items-center gap-1.5 bg-roti-secondary/10 border border-blue-500/25
                                 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                   {stats.nuevos} nuevo{stats.nuevos !== 1 ? 's' : ''}
                </span>
              )}
              {stats.preparando > 0 && (
                <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25
                                 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                   {stats.preparando} en prep.
                </span>
              )}
              {stats.listos > 0 && (
                <span className="flex items-center gap-1.5 bg-roti-success/10 border border-emerald-500/25
                                 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                   {stats.listos} listo{stats.listos !== 1 ? 's' : ''}
                </span>
              )}
              {!cargando && pedidos.length === 0 && (
                <span className="text-xs text-slate-600">Sin pedidos activos</span>
              )}
              {error && (
                <span className="text-xs text-red-400">{error}</span>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {/* Filtro de vista */}
            <div className="flex bg-[#3A4A51] rounded-lg border border-[#4A5E68] p-0.5 text-xs">
              {[
                { v: 'activos', label: 'Activos' },
                { v: 'listos',  label: 'Listos'  },
                { v: 'todos',   label: 'Todos'   },
              ].map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => setFiltroEstado(v)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filtroEstado === v
                      ? 'bg-[#4A5E68] text-roti-cream'
                      : 'text-roti-cream/60 hover:text-roti-cream'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Columnas */}
            <div className="hidden md:flex bg-[#3A4A51] rounded-lg border border-[#4A5E68] p-0.5 text-xs gap-0.5">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setColumnas(n)}
                  className={`w-7 h-7 rounded-md font-bold transition-colors ${
                    columnas === n ? 'bg-[#4A5E68] text-roti-cream' : 'text-roti-cream/50 hover:text-roti-cream/80'
                  }`}
                  title={`${n} columnas`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Sonido */}
            <button
              onClick={() => setSonidoActivo((v) => !v)}
              title={sonidoActivo ? 'Silenciar alertas' : 'Activar alertas'}
              className={`p-2 rounded-lg border transition-colors ${
                sonidoActivo
                  ? 'bg-[#4A5E68] border-[#4A5E68] text-amber-400'
                  : 'bg-[#3A4A51] border-[#4A5E68] text-slate-600'
              }`}
            >
              {sonidoActivo ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z"/>
                  <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M9.547 3.062A.75.75 0 0110 3.75v12.5a.75.75 0 01-1.264.546L4.703 13H3.167a.75.75 0 01-.7-.48A6.985 6.985 0 012 10c0-.887.165-1.736.468-2.52a.75.75 0 01.7-.48h1.535l4.033-3.796a.75.75 0 01.811-.142zM13.28 7.22a.75.75 0 10-1.06 1.06L13.94 10l-1.72 1.72a.75.75 0 001.06 1.06L15 11.06l1.72 1.72a.75.75 0 101.06-1.06L16.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L15 8.94l-1.72-1.72z"/>
                </svg>
              )}
            </button>

            {/* Limpiar listos */}
            {stats.listos > 0 && (
              <button
                onClick={handleLimpiarListos}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#3A4A51] border border-[#4A5E68]
                           text-roti-cream/60 hover:text-roti-cream hover:border-[#4A5E68] transition-colors"
              >
                Limpiar listos
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto p-4">
        {cargando && pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-roti-cream/50 font-medium text-lg">Cargando cocina…</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {pedidos.length === 0 ? (
              <>
                <div className="text-6xl mb-4 opacity-30"></div>
                <p className="text-roti-cream/50 font-medium text-lg">Sin pedidos en cocina</p>
                <p className="text-slate-600 text-sm mt-2 max-w-sm">
                  Los pedidos del tótem, delivery o Caja aparecen aquí automáticamente al confirmarse.
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 opacity-40"></div>
                <p className="text-roti-cream/50 font-medium">
                  {filtroEstado === 'listos' ? 'No hay pedidos listos' : 'Todos los pedidos están listos'}
                </p>
                <button
                  onClick={() => setFiltroEstado('todos')}
                  className="mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Ver todos los pedidos
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-4 auto-rows-max`}>
            {pedidosFiltrados.map((pedido) => (
              <TarjetaPedido
                key={pedido.id}
                pedido={pedido}
                onCambiarEstado={handleCambiarEstado}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}
      </div>

      {/* LEYENDA */}
      <div className="flex-shrink-0 border-t border-[#3A4A51] px-4 py-2 bg-roti-dark/80
                      flex items-center gap-6 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-roti-secondary"></span> Nuevo pedido
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> En preparación
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-roti-success"></span> Listo
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="w-2 h-2 rounded-full bg-roti-primary"></span> Demorado (&gt;5 min nuevo / &gt;10 min prep)
        </span>
      </div>
    </div>
  );
};

export default CocinaKDS;
