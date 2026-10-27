import { useState, useMemo, useEffect, useRef, Component } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { agregarPedidoKDS } from '../data/pedidosKDS';
import { PRODUCTOS_INICIALES, leerProductos, guardarProductos } from '../data/productos';

const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// Colores:
// BG: #2A363B
// ACTION: #E84A5F
// PRECIOS: #FECEA8

// Screensaver Component
const Screensaver = ({ onStart, message }) => (
  <div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-all bg-[#2A363B] no-print"
    onClick={onStart}
  >
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
    <div className="relative z-10 flex flex-col items-center animate-pulse">
      <div className="w-40 h-40 bg-[#E84A5F] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(232,74,95,0.6)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
      </div>
      <h1 className="text-6xl font-black text-white text-center tracking-tight shadow-black drop-shadow-2xl uppercase whitespace-pre-wrap">
        {message}
      </h1>
    </div>
  </div>
);

// Product Card Component - Elegant Dark Aesthetic
const ProductCard = ({ producto, onClick }) => {
  const desc = producto.descripcion || 'Plato elaborado con ingredientes frescos de primera calidad';

  return (
    <div
      onClick={() => onClick(producto)}
      className="group flex flex-col items-center text-center p-5 rounded-3xl bg-[#1a1a1a] hover:bg-[#222222] border border-white/8 hover:border-[#d4a843]/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]"
      tabIndex={0}
      role="button"
      aria-label={`Ver o agregar ${producto.nombre} por ${formatPeso(producto.precio)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(producto);
        }
      }}
    >
      {/* Product Image Container with rounded corners and object-cover */}
      <div className="w-full h-44 sm:h-52 md:h-56 rounded-2xl overflow-hidden mb-3 bg-white/5 border border-white/10 shadow-md relative">
        {producto.imagenUrl ? (
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/roti_logo.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 p-4 text-center">
            <img src="/roti_logo.jpg" alt="La Rotisería" className="w-12 h-12 rounded-full mb-1 border border-white/20 opacity-70 object-cover" />
            <span className="text-white/40 text-xs font-semibold">La Rotisería</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <div>
          <h3 className="font-bold text-base md:text-lg text-white uppercase tracking-wide leading-snug mb-1.5 text-center group-hover:text-[#d4a843] transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-xs md:text-sm text-white/60 text-center mb-4 line-clamp-2 leading-relaxed font-normal px-1">
            {desc}
          </p>
        </div>

        {/* Price & Add Action */}
        <div className="pt-1 flex flex-col items-center gap-2.5">
          <span className="text-xl md:text-2xl font-black text-[#FECEA8] tracking-tight">
            {formatPeso(producto.precio)}
          </span>
          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] hover:from-[#ff5469] hover:to-[#e5b74b] text-white text-xs font-bold uppercase tracking-wider shadow-md group-hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

// Customization Modal - Elegant Dark Style
const ModalPersonalizacion = ({ producto, onClose, onConfirm }) => {
  const [cantidad, setCantidad] = useState(1);
  const [aclaracion, setAclaracion] = useState('');

  const opAclaraciones = [
    "Sin sal", "Poca sal", "Sin condimentos", "Bien cocido", "Para compartir"
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181818] text-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/15">
        <div className="p-6 border-b border-white/10 flex gap-5 items-center bg-[#121212]">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 shadow-md">
            {producto.imagenUrl ? (
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/40 text-xs">Sin Foto</div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">{producto.nombre}</h2>
            <p className="text-2xl font-black text-[#FECEA8] mt-1">{formatPeso(producto.precio)}</p>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-[#181818]">
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Aclaraciones opcionales</h3>
            <div className="flex flex-wrap gap-2">
              {opAclaraciones.map(op => (
                <button
                  key={op}
                  onClick={() => setAclaracion(prev => prev === op ? '' : op)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${aclaracion === op
                      ? 'bg-[#E84A5F] text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/15 border border-white/10'
                    }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Cantidad</h3>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                className="w-12 h-12 rounded-full bg-white/10 text-white text-xl font-bold hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                -
              </button>
              <span className="text-3xl font-black text-white w-10 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(c => c + 1)}
                className="w-12 h-12 rounded-full bg-[#E84A5F] text-white text-xl font-bold hover:bg-red-600 active:scale-95 flex items-center justify-center shadow-md transition-all cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3 bg-[#121212]">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-white/10 text-white/80 text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm({ ...producto, cantidad, aclaracion })}
            className="flex-[2] py-3.5 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
          >
            Agregar {formatPeso(producto.precio * cantidad)}
          </button>
        </div>
      </div>
    </div>
  );
};


export function PortalCliente() {
  const { token } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('TOCA LA PANTALLA\nPARA COMENZAR');
  const [productos, setProductos] = useState(() => {
    const saved = leerProductos();
    return (Array.isArray(saved) && saved.length > 0) ? saved : PRODUCTOS_INICIALES;
  });
  const [categorias, setCategorias] = useState([]);

  const [carrito, setCarrito] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');

  const [modalProd, setModalProd] = useState(null);

  // Idle State
  const [isIdle, setIsIdle] = useState(true);
  const idleTimeout = useRef(null);

  // Pago
  const [paso, setPaso] = useState(1); // 1: Menú, 2: Pagar (Opciones), 3: Éxito
  const [metodoPago, setMetodoPago] = useState('');
  const [numPedido, setNumPedido] = useState(null);

  // Safe Fallback para Productos (Defensive Coding)
  const productosValidos = useMemo(() => {
    if (Array.isArray(productos) && productos.length > 0) {
      return productos;
    }
    const saved = leerProductos();
    return (Array.isArray(saved) && saved.length > 0) ? saved : PRODUCTOS_INICIALES;
  }, [productos]);

  const safeProducts = Array.isArray(productosValidos) ? productosValidos : PRODUCTOS_INICIALES;

  const resetProductosPorDefecto = () => {
    try {
      localStorage.removeItem('rotiseria_productos');
      localStorage.removeItem('products');
      localStorage.setItem('products_version', '1.0');
      guardarProductos(PRODUCTOS_INICIALES);
    } catch (_) { }
    setProductos(PRODUCTOS_INICIALES);
    setCatActiva('Todas');
  };


  // Data fetch — con fallback a productos local/localStorage si el backend no está disponible
  useEffect(() => {
    const fetchData = async () => {
      let productosOk = false;

      try {
        const [resConf, resProd, resCat] = await Promise.all([
          fetch(`/api/config`, { headers: { 'Authorization': `Bearer ${token}` }, signal: AbortSignal.timeout(3000) }),
          fetch(`/api/productos`, { headers: { 'Authorization': `Bearer ${token}` }, signal: AbortSignal.timeout(3000) }),
          fetch(`/api/categorias`, { headers: { 'Authorization': `Bearer ${token}` }, signal: AbortSignal.timeout(3000) }),
        ]);

        if (resConf.ok) {
          const conf = await resConf.json();
          if (conf.welcomeMessage) setWelcomeMessage(conf.welcomeMessage);
        }

        if (resProd.ok) {
          const prods = await resProd.json();
          if (Array.isArray(prods)) {
            const activos = prods.filter(p => p && p.activo !== false);
            if (activos.length > 0) {
              setProductos(activos);
              guardarProductos(activos);
              productosOk = true;
            }
          }
        }

        if (resCat.ok) {
          const cats = await resCat.json();
          if (Array.isArray(cats) && cats.length > 0) {
            setCategorias(cats.filter(c => c && c.activo !== false));
          }
        }
      } catch (err) {
        console.warn('[PortalCliente] API no disponible, usando catálogo local:', err.message);
      }

      // Fallback: si la API no devolvió productos, carga los guardados o iniciales
      if (!productosOk) {
        const saved = leerProductos();
        const base = (Array.isArray(saved) && saved.length > 0) ? saved : PRODUCTOS_INICIALES;
        const local = base
          .filter(p => p && p.activo !== false)
          .map(p => ({ ...p, categoriaNombre: p.categoriaNombre || p.categoria }));
        setProductos(local);

        const cats = [...new Set(local.map(p => p.categoriaNombre))]
          .map((nombre, i) => ({ id: i + 1, nombre, activo: true }));
        setCategorias(cats);
      }
    };

    fetchData();

    const handleRealtimeUpdate = () => {
      const saved = leerProductos();
      const base = (Array.isArray(saved) && saved.length > 0) ? saved : PRODUCTOS_INICIALES;
      const local = base
        .filter(p => p && p.activo !== false)
        .map(p => ({ ...p, categoriaNombre: p.categoriaNombre || p.categoria }));
      setProductos(local);
    };

    window.addEventListener('rotiseria_productos_updated', handleRealtimeUpdate);
    window.addEventListener('storage', handleRealtimeUpdate);
    return () => {
      window.removeEventListener('rotiseria_productos_updated', handleRealtimeUpdate);
      window.removeEventListener('storage', handleRealtimeUpdate);
    };
  }, [token, isIdle]);

  // Activity Tracker
  const resetIdle = () => {
    if (isIdle) {
      setIsIdle(false);
      setCarrito([]);
      setPaso(1);
    }
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => {
      setIsIdle(true);
      setModalProd(null);
      setPaso(1);
    }, 30000);
  };

  useEffect(() => {
    const evts = ['touchstart', 'click', 'mousemove', 'scroll'];
    evts.forEach(e => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => evts.forEach(e => window.removeEventListener(e, resetIdle));
  }, [isIdle]);

  const getCategoria = (p) => (p && (p.categoriaNombre || p.categoria)) ? String(p.categoriaNombre || p.categoria) : '';

  const categoriasMenu = useMemo(() => {
    const catsFromProds = [...new Set(safeProducts.map(getCategoria))].filter(Boolean);
    return ['Todas', ...catsFromProds];
  }, [safeProducts]);

  const productosFiltrados = useMemo(() => {
    if (!catActiva || catActiva.toUpperCase() === 'TODAS' || catActiva.toLowerCase() === 'todas') {
      return safeProducts.filter(p => p && p.activo !== false);
    }
    return safeProducts.filter(p =>
      p && p.activo !== false && getCategoria(p).toLowerCase() === catActiva.toLowerCase()
    );
  }, [safeProducts, catActiva]);

  const safeCarrito = Array.isArray(carrito) ? carrito : [];
  const subtotal = safeCarrito.reduce((s, i) => s + (Number(i?.precio) || 0) * (Number(i?.cantidad) || 1), 0);

  // Actions
  const agregarAlCarrito = (item) => {
    if (!item) return;
    setCarrito(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const idx = arr.findIndex(i => i.id === item.id && i.aclaracion === item.aclaracion);
      if (idx >= 0) {
        const nuevo = [...arr];
        nuevo[idx].cantidad += (Number(item.cantidad) || 1);
        return nuevo;
      }
      return [...arr, item];
    });
    setModalProd(null);
  };

  const quitarDelCarrito = (idx) => {
    setCarrito(prev => (Array.isArray(prev) ? prev : []).filter((_, i) => i !== idx));
  };

  const procesarPago = async (metodo) => {
    setMetodoPago(metodo);
    const ticketNum = Math.floor(Math.random() * 900) + 100;
    setNumPedido(ticketNum);

    const itemsDetalle = safeCarrito.map(i => ({
      id: i.id,
      nombre: (i.nombre || 'Producto') + (i.aclaracion ? ` (${i.aclaracion})` : ''),
      cantidad: i.cantidad || 1,
      precio: i.precio || 0,
      imagenUrl: i.imagenUrl
    }));

    try {
      const nota = `Ticket #${ticketNum} - Pago: ${metodo}`;

      const res = await fetch(`/api/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items: itemsDetalle, total: subtotal, metodo: metodo === 'Efectivo' ? 'efectivo' : 'mercadopago', estado: 'completado' })
      });
      if (!res.ok) throw new Error('Error al registrar venta');

      const idKDS = Date.now();
      const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      agregarPedidoKDS({ id: idKDS, hora, timestamp: idKDS, items: itemsDetalle, total: subtotal, metodo: 'totem', nota });

      setPaso(3);

      setTimeout(() => {
        window.print();
      }, 500);

    } catch (e) {
      console.error('Error al procesar pago:', e);
      alert(`Error procesando pedido: ${e.message || 've a la caja por favor.'}`);
    }
  };

  // Rendering
  if (isIdle) return <Screensaver onStart={resetIdle} message={welcomeMessage} />;

  return (
    <div className="fixed inset-0 bg-[#121212] flex overflow-hidden font-sans select-none z-[1000] no-print text-white">

      {/* LEFT COL: Categories & Products (Solid Dark #121212) */}
      <div className="flex-1 flex flex-col h-full bg-[#121212] overflow-hidden">

        {/* Top Header */}
        <div className="bg-[#121212] px-8 py-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4a843] shadow-md">
              <img src="/roti_logo.jpg" alt="La Rotisería" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-script text-2xl text-[#d4a843] leading-none">La Rotisería</span>
              <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-0.5">Hace tu Pedido</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#d4a843] bg-[#d4a843]/10 border border-[#d4a843]/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              {Array.isArray(productosFiltrados) ? productosFiltrados.length : 0} Productos
            </span>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm border border-white/20 transition-all shadow-sm cursor-pointer"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Category Tabs Navigation */}
        <div className="bg-[#121212] border-b border-white/10 px-6 pt-3 flex-shrink-0">
          <div
            className="max-w-7xl mx-auto flex items-center justify-start gap-8 overflow-x-auto snap-x hide-scrollbar"
            role="tablist"
            aria-label="Categorías del menú"
          >
            {categoriasMenu.map((cat) => {
              const isActive = catActiva === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={() => setCatActiva(cat)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCatActiva(cat);
                    }
                  }}
                  className={`snap-start flex-shrink-0 pb-3 text-sm md:text-base font-bold uppercase tracking-widest transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] ${isActive
                      ? 'text-[#d4a843] border-b-2 border-[#d4a843]'
                      : 'text-white/40 hover:text-white/80 border-b-2 border-transparent'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with Defensive Validation */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#121212]">
          {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {productosFiltrados.map(p => p && (
                <ProductCard key={p.id || p.nombre} producto={p} onClick={setModalProd} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-white/50">
              <img src="/roti_logo.jpg" alt="La Rotisería" className="w-20 h-20 rounded-full mb-4 opacity-50 border border-white/20 object-cover" />
              <p className="text-xl font-bold text-white/80 mb-2">No hay productos disponibles en esta vista</p>
              <p className="text-sm text-white/40 mb-6 max-w-md">Si el catálogo está vacío o hubo un problema al sincronizar, puedes cargar los productos por defecto o volver al inicio.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetProductosPorDefecto}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer"
                >
                  Cargar Productos por Defecto
                </button>
                <button
                  onClick={() => setCatActiva('Todas')}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
                >
                  Ver Todas las Categorías
                </button>
                <Link
                  to="/"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-1"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          )}
          <div className="h-24" />
        </div>
      </div>

      {/* RIGHT COL: Cart Panel (Dark Theme) */}
      <div className="w-[420px] max-w-[90vw] bg-[#161c1f] flex flex-col border-l border-white/10 shadow-2xl">
        <div className="p-6 bg-[#121212] border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Tu Pedido</h2>
          <span className="text-xs font-bold text-[#d4a843] bg-[#d4a843]/15 border border-[#d4a843]/30 px-3 py-1 rounded-full">
            {safeCarrito.reduce((s, i) => s + (i.cantidad || 1), 0)} ítems
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#161c1f]">
          {safeCarrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white/20 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-xl font-bold text-white/80 text-center">Tu carrito está vacío</p>
              <p className="text-xs text-white/40 text-center mt-1">Seleccioná un plato para comenzar</p>
            </div>
          ) : (
            safeCarrito.map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-4 flex gap-4 items-center border border-white/10 shadow-xs">
                <div className="w-10 h-10 bg-[#E84A5F]/20 text-[#E84A5F] rounded-xl flex items-center justify-center font-black text-lg border border-[#E84A5F]/30">
                  {item.cantidad}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base leading-tight">{item.nombre}</h4>
                  {item.aclaracion && <p className="text-white/50 text-xs mt-0.5">{item.aclaracion}</p>}
                  <p className="text-[#FECEA8] font-black text-base mt-1">{formatPeso(item.precio * item.cantidad)}</p>
                </div>
                <button
                  onClick={() => quitarDelCarrito(idx)}
                  className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20"
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout Button */}
        <div className="p-6 bg-[#121212] border-t border-white/10">
          <div className="flex justify-between items-end mb-6">
            <span className="text-white/50 text-base font-bold uppercase tracking-wider">Total</span>
            <span className="text-[#FECEA8] text-3xl font-black">{formatPeso(subtotal)}</span>
          </div>
          <button
            disabled={carrito.length === 0}
            onClick={() => setPaso(2)}
            className="btn-orange-cta w-full py-4 rounded-full text-white text-lg font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Pagar Pedido
          </button>
        </div>
      </div>

      {/* MODALS */}
      {modalProd && <ModalPersonalizacion producto={modalProd} onClose={() => setModalProd(null)} onConfirm={agregarAlCarrito} />}

      {/* PAGO MODAL */}
      {paso === 2 && (
        <div className="fixed inset-0 z-[150] bg-black/90 flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-black text-white mb-12 text-center uppercase">¿Cómo querés pagar?</h2>
          <div className="flex gap-8 max-w-4xl w-full">
            <button
              onClick={() => procesarPago('Efectivo')}
              className="flex-1 bg-[#2A363B] border-4 border-white/10 rounded-3xl p-12 flex flex-col items-center gap-6 active:border-[#E84A5F] transition-all"
            >
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-6xl">💵</span>
              </div>
              <span className="text-4xl font-bold text-white">Efectivo</span>
              <span className="text-xl text-white/50 text-center">Pagás en caja al retirar</span>
            </button>
            <button
              onClick={() => procesarPago('Mercado Pago')}
              className="flex-1 bg-[#2A363B] border-4 border-[#009EE3]/50 rounded-3xl p-12 flex flex-col items-center gap-6 active:border-[#009EE3] transition-all"
            >
              <div className="w-32 h-32 bg-[#009EE3]/20 rounded-full flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <span className="text-4xl font-bold text-[#009EE3]">Mercado Pago</span>
              <span className="text-xl text-white/50 text-center">Escaneás el QR en caja</span>
            </button>
          </div>
          <button
            onClick={() => setPaso(1)}
            className="mt-12 px-12 py-5 rounded-2xl border-2 border-white/20 text-white text-2xl font-bold active:bg-white/10"
          >
            Volver al pedido
          </button>
        </div>
      )}

      {/* EXITO MODAL */}
      {paso === 3 && (
        <div className="fixed inset-0 z-[200] bg-[#E84A5F] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 no-print">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-12 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-24 h-24 text-[#E84A5F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-6xl font-black text-white mb-6 uppercase">¡Pedido Confirmado!</h2>
          <p className="text-3xl text-white/90 font-medium mb-12">Por favor recordá este número:</p>

          <div className="bg-white px-16 py-8 rounded-3xl shadow-2xl mb-12">
            <span className="text-3xl text-[#2A363B] font-bold uppercase tracking-widest block mb-2">Pedido</span>
            <span className="text-8xl text-[#2A363B] font-black">#{numPedido}</span>
          </div>

          <p className="text-2xl text-white/80 max-w-2xl">
            {metodoPago === 'Efectivo'
              ? 'Acercate a la caja para abonar y retirar tu pedido.'
              : 'Acercate a la caja para escanear el QR y retirar tu pedido.'}
          </p>

          {/* Autoclose hint */}
          <div className="mt-16 text-white/50 text-xl flex items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Volviendo al inicio...
          </div>
        </div>
      )}

      {/* TICKET DE IMPRESION OCULTO */}
      {paso === 3 && (
        <div className="print-only hidden font-mono text-black bg-white w-[80mm] p-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black mb-1">ROTISERIA ANTI</h1>
            <p className="text-sm text-black">Fecha: {new Date().toLocaleDateString('es-AR')}</p>
            <p className="text-sm text-black">Hora: {new Date().toLocaleTimeString('es-AR')}</p>
          </div>

          <div className="text-center mb-4 border-y-2 border-black border-dashed py-3">
            <p className="text-sm font-bold">PEDIDO TÓTEM</p>
            <h2 className="text-6xl font-black mt-2">#{numPedido}</h2>
            <p className="text-sm font-bold mt-2 uppercase">Pago: {metodoPago}</p>
          </div>

          <div className="mb-4">
            {carrito.map((i, idx) => (
              <div key={idx} className="mb-2 text-sm font-bold">
                <div className="flex justify-between">
                  <span className="w-8">{i.cantidad}x</span>
                  <span className="flex-1 px-1">{i.nombre}</span>
                  <span className="w-16 text-right">${i.precio * i.cantidad}</span>
                </div>
                {i.aclaracion && <div className="pl-9 text-xs mt-1">* {i.aclaracion}</div>}
              </div>
            ))}
          </div>

          <div className="border-t-2 border-black border-dashed pt-3 pb-8 flex justify-between font-black text-xl">
            <span>TOTAL:</span>
            <span>${subtotal}</span>
          </div>

          <div className="text-center mt-6 text-sm font-bold pb-12">
            ¡GRACIAS POR TU COMPRA!
            <br />
            Retirá por mostrador
          </div>
        </div>
      )}

      {/* Hide scrollbars globally for this component */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            display: block !important;
            width: 80mm;
            padding: 0;
            margin: 0;
          }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}

class ClienteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ClienteErrorBoundary] Error capturado en /cliente:', error, errorInfo);
    try {
      localStorage.removeItem('rotiseria_productos');
      localStorage.removeItem('products');
    } catch (_) { }
  }

  handleReset = () => {
    try {
      localStorage.clear();
      localStorage.setItem('products_version', '1.0');
    } catch (_) { }
    this.setState({ hasError: false, error: null });
    window.location.href = '/cliente';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#121212] text-white flex flex-col justify-between p-6 z-[9999]">
          {/* Header con botón de volver */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 px-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4a843]">
                <img src="/roti_logo.jpg" alt="La Rotisería" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-script text-2xl text-[#d4a843]">La Rotisería</span>
                <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-0.5">Hace tu Pedido</span>
              </div>
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all shadow-md cursor-pointer"
            >
              ← Volver al Inicio
            </Link>
          </div>

          {/* Mensaje de error y restauración */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 text-red-400 flex items-center justify-center mb-6 text-4xl shadow-lg">
              ⚠️
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Ocurrió un inconveniente en la tienda</h2>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">
              Capturamos un error inesperado al renderizar los productos. Hemos reseteado los datos locales dañados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white font-bold text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer hover:opacity-90"
              >
                Cargar Productos por Defecto
              </button>
              <Link
                to="/"
                className="flex-1 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-center font-bold text-sm tracking-wider uppercase border border-white/20 transition-all shadow-md cursor-pointer"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>

          <div className="text-center text-white/30 text-xs pt-4 border-t border-white/10">
            La Rotisería — Sistema de Pedidos
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function PortalClienteWrapped(props) {
  return (
    <ClienteErrorBoundary>
      <PortalCliente {...props} />
    </ClienteErrorBoundary>
  );
}

