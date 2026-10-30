import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRODUCTOS_INICIALES, leerProductos, guardarProductos } from '../data/productos';

const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// 
// MODAL PARA EDITAR / AGREGAR PRODUCTO CON VISTA PREVIA DE IMAGEN
// 
const ModalEditarProducto = ({ producto, categorias, onGuardar, onCancelar }) => {
  const esEdicion = !!producto;
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [precio, setPrecio] = useState(producto?.precio ? String(producto.precio) : '');
  const [categoriaNombre, setCategoriaNombre] = useState(producto?.categoriaNombre || producto?.categoria || 'Platos Principales');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [imagenUrl, setImagenUrl] = useState(producto?.imagenUrl || '');
  const [mostrarPreview, setMostrarPreview] = useState(true);
  const [errorImg, setErrorImg] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  const handleProbableUrlChange = (val) => {
    setImagenUrl(val);
    setErrorImg(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorForm('El nombre del producto es obligatorio');
      return;
    }
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      setErrorForm('Ingresa un precio válido');
      return;
    }

    onGuardar({
      id: producto?.id || Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      categoria: categoriaNombre,
      categoriaNombre: categoriaNombre,
      descripcion: descripcion.trim() || 'Plato elaborado con ingredientes frescos de primera calidad.',
      imagenUrl: imagenUrl.trim(),
      activo: producto?.activo !== false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#121212] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#d4a843]">
              📸
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              {esEdicion ? `Editar Producto: ${producto.nombre}` : 'Agregar Nuevo Producto'}
            </h2>
          </div>
          <button 
            onClick={onCancelar}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorForm && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-semibold">
                {errorForm}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Nombre del Producto *
              </label>
              <input 
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Milanesa de Carne"
                className="w-full bg-[#222] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a843]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                  Precio (ARS) *
                </label>
                <input 
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="20000"
                  className="w-full bg-[#222] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a843]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                  Categoría
                </label>
                <select 
                  value={categoriaNombre}
                  onChange={(e) => setCategoriaNombre(e.target.value)}
                  className="w-full bg-[#222] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4a843]"
                >
                  {categorias.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Descripción del Plato
              </label>
              <textarea 
                rows="2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Filete de nalga tierna con empanado crocante..."
                className="w-full bg-[#222] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4a843] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#d4a843] uppercase tracking-wider mb-1">
                URL de la Imagen (`imagenUrl`)
              </label>
              <input 
                type="url"
                value={imagenUrl}
                onChange={(e) => handleProbableUrlChange(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#222] border border-[#d4a843]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4a843]"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Pega aquí la URL directa de la imagen (Unsplash, CDN o PNG).
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setMostrarPreview(!mostrarPreview)}
                className="text-xs font-semibold text-[#d4a843] hover:underline flex items-center gap-1 cursor-pointer"
              >
                👁️ {mostrarPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancelar}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>

          {/* Seccion Vista Previa Live Card */}
          {mostrarPreview && (
            <div className="flex flex-col items-center justify-center p-4 bg-[#121212] rounded-2xl border border-white/10">
              <span className="text-[11px] font-bold text-[#d4a843] uppercase tracking-widest mb-3">
                Vista Previa en Tienda Pública
              </span>

              {/* Card Preview */}
              <div className="w-full max-w-[240px] p-4 rounded-3xl bg-[#1a1a1a] border border-white/10 shadow-xl flex flex-col items-center text-center">
                <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/10 relative">
                  {imagenUrl && !errorImg ? (
                    <img 
                      src={imagenUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={() => setErrorImg(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-white/5">
                      <img src="/roti_logo.jpg" alt="Fallback" className="w-10 h-10 rounded-full mb-1 border border-white/20 opacity-70 object-cover" />
                      <span className="text-[10px] text-white/40 font-semibold">Placeholder Marca</span>
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-sm text-white uppercase tracking-wide line-clamp-1 mb-1">
                  {nombre || 'Nombre del Plato'}
                </h4>
                <p className="text-[11px] text-white/60 line-clamp-2 mb-3 px-1">
                  {descripcion || 'Descripción del plato servido con ingredientes de calidad...'}
                </p>
                <span className="text-lg font-black text-[#FECEA8] mb-2">
                  {formatPeso(Number(precio) || 0)}
                </span>
                <span className="w-full py-1.5 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-[10px] font-bold uppercase">
                  + Agregar
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState('productos'); // 'productos' | 'usuarios'

  // Productos State
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalProducto, setModalProducto] = useState(null); // null | 'nuevo' | productObj
  const [mensajeProd, setMensajeProd] = useState('');

  // Usuarios State
  const [usuarios, setUsuarios] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('CAJERO');
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensajeUser, setMensajeUser] = useState('');
  const [errorUser, setErrorUser] = useState('');

  // Cargar Productos
  const cargarProductos = async () => {
    let loaded = false;
    try {
      const res = await fetch('/api/productos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setProductos(data);
          guardarProductos(data);
          loaded = true;
        }
      }
    } catch (e) {
      console.warn('[AdminDashboard] API no disponible, usando localStorage');
    }

    if (!loaded) {
      const saved = leerProductos();
      setProductos((saved && saved.length > 0) ? saved : PRODUCTOS_INICIALES);
    }
  };

  // Cargar Usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`/api/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProductos();
    fetchUsuarios();
  }, [token]);

  // Lista de Categorías para el modal
  const categoriasDisponibles = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoriaNombre || p.categoria))].filter(Boolean);
    return cats.length > 0 ? cats : ['Platos Principales', 'Bebidas'];
  }, [productos]);

  // Guardar Producto (Editar / Agregar)
  const handleGuardarProducto = async (prodData) => {
    const isEdit = productos.some(p => p.id === prodData.id);
    let updatedList = [];

    if (isEdit) {
      updatedList = productos.map(p => p.id === prodData.id ? prodData : p);
    } else {
      updatedList = [prodData, ...productos];
    }

    setProductos(updatedList);
    guardarProductos(updatedList);

    // Intentar sincronizar con backend API si está activo
    try {
      const url = isEdit ? `/api/productos/${prodData.id}` : `/api/productos`;
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(prodData)
      });
    } catch (e) {
      console.warn('[Admin] No se pudo guardar en backend, guardado en localStorage');
    }

    // Notificar eventos para actualización en tiempo real en la tienda pública
    window.dispatchEvent(new Event('rotiseria_productos_updated'));
    window.dispatchEvent(new Event('storage'));

    setMensajeProd(`Producto "${prodData.nombre}" ${isEdit ? 'actualizado' : 'creado'} correctamente.`);
    setTimeout(() => setMensajeProd(''), 4000);
    setModalProducto(null);
  };

  // Eliminar producto
  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    const updated = productos.filter(p => p.id !== id);
    setProductos(updated);
    guardarProductos(updated);

    try {
      await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    window.dispatchEvent(new Event('rotiseria_productos_updated'));
    setMensajeProd('Producto eliminado correctamente.');
    setTimeout(() => setMensajeProd(''), 4000);
  };

  // Guardar nuevo Usuario
  const handleSubmitNuevoUsuario = async (e) => {
    e.preventDefault();
    setMensajeUser('');
    setErrorUser('');
    try {
      const response = await fetch(`/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, rol })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al crear');
      
      setMensajeUser('Usuario creado exitosamente');
      setUsername('');
      setPassword('');
      setRol('CAJERO');
      fetchUsuarios();
    } catch (err) {
      setErrorUser(err.message);
    }
  };

  // Editar Usuario
  const handleEditUsuarioSubmit = async (e) => {
    e.preventDefault();
    setMensajeUser('');
    setErrorUser('');
    try {
      const response = await fetch(`/api/usuarios/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usuarioEditando.username,
          rol: usuarioEditando.rol,
          password: usuarioEditando.password || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar');
      
      setMensajeUser('Usuario actualizado correctamente');
      setUsuarioEditando(null);
      fetchUsuarios();
    } catch (err) {
      setErrorUser(err.message);
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }, [productos, busqueda]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>⚙️ Panel de Administración</span>
          </h1>
          <p className="mt-1 text-white/60 text-sm">
            Bienvenido, <strong className="text-[#d4a843]">{user?.username || 'Administrador'}</strong>. Gestiona productos, imágenes y usuarios del sistema.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#121212] rounded-2xl border border-white/10">
          <button 
            onClick={() => setTab('productos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'productos' 
                ? 'bg-[#d4a843] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            📸 Gestión de Productos & Imágenes
          </button>
          <button 
            onClick={() => setTab('usuarios')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'usuarios' 
                ? 'bg-[#d4a843] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            👥 Usuarios
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          TAB 1: GESTIÓN DE PRODUCTOS E IMÁGENES
      ════════════════════════════════════════════════════ */}
      {tab === 'productos' && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Catálogo de Productos & URLs de Imágenes</span>
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Cambia la URL de imagen o datos de cualquier plato y actualízalo en tiempo real en "Hace tu Pedido".
              </p>
            </div>

            <button 
              onClick={() => setModalProducto('nuevo')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
            >
              <span>+ Agregar Producto</span>
            </button>
          </div>

          {mensajeProd && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>✅ {mensajeProd}</span>
              <button onClick={() => setMensajeProd('')} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-[#121212] p-2.5 rounded-2xl border border-white/10">
            <span className="text-white/40 pl-2">🔍</span>
            <input 
              type="text" 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)} 
              placeholder="Buscar producto por nombre (ej: Milanesa, Pizza, Coca...)" 
              className="bg-transparent w-full text-white text-xs placeholder-white/40 focus:outline-none" 
            />
          </div>

          {/* Tabla de Productos con Miniatura y Boton Editar Imagen */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#181818] text-white/50 uppercase tracking-widest text-[10px] border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Miniatura</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">URL de la Imagen (`imagenUrl`)</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-white/40 font-semibold">
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/15 flex-shrink-0 relative">
                          <img 
                            src={p.imagenUrl || '/roti_logo.jpg'} 
                            alt={p.nombre} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/roti_logo.jpg';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{p.nombre}</div>
                        <div className="text-[11px] text-white/50 line-clamp-1">{p.descripcion}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/30 text-[10px] font-bold uppercase">
                          {p.categoriaNombre || p.categoria || 'Menú'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-[#FECEA8] text-sm">
                        {formatPeso(p.precio)}
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <span className="text-[10px] text-white/60 font-mono block truncate" title={p.imagenUrl}>
                          {p.imagenUrl || 'Sin URL asignada'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalProducto(p)}
                            className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            ✏️ Editar Imagen / Datos
                          </button>
                          <button
                            onClick={() => handleEliminarProducto(p.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB 2: GESTIÓN DE USUARIOS
      ════════════════════════════════════════════════════ */}
      {tab === 'usuarios' && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-[#d4a843] uppercase tracking-wider">
            Gestión de Usuarios del Sistema
          </h2>

          {mensajeUser && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-bold">
              {mensajeUser}
            </div>
          )}

          {errorUser && (
            <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-2xl text-xs font-bold">
              {errorUser}
            </div>
          )}

          {/* Formulario Crear Usuario */}
          <form onSubmit={handleSubmitNuevoUsuario} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-[#121212] p-4 rounded-2xl border border-white/10">
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#222] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#222] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d4a843]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full bg-[#222] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#d4a843]"
              >
                <option value="CAJERO">Cajero</option>
                <option value="COCINERO">Cocinero</option>
                <option value="ADMIN">Administrador</option>
                <option value="GERENTE">Gerente</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E84A5F] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors h-[36px] cursor-pointer"
            >
              + Crear Usuario
            </button>
          </form>

          {/* Lista Usuarios */}
          <div className="bg-[#121212] rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#181818] text-white/50 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-white/40">Cargando usuarios...</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white/40">#{u.id}</td>
                      <td className="px-4 py-3 font-bold text-white">{u.username}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setUsuarioEditando({ ...u, password: '' })}
                          className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-xl text-xs font-bold border border-blue-500/30 cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {modalProducto && (
        <ModalEditarProducto
          producto={modalProducto === 'nuevo' ? null : modalProducto}
          categorias={categoriasDisponibles}
          onGuardar={handleGuardarProducto}
          onCancelar={() => setModalProducto(null)}
        />
      )}

      {/* Modal Editar Usuario */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/15 shadow-2xl w-full max-w-md text-white">
            <h3 className="text-xl font-bold text-[#d4a843] mb-4">Editar Usuario</h3>
            <form onSubmit={handleEditUsuarioSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1 font-bold">Nombre de usuario</label>
                <input
                  type="text"
                  value={usuarioEditando.username}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, username: e.target.value })}
                  className="w-full bg-[#222] text-white rounded-xl px-3.5 py-2.5 border border-white/15 focus:outline-none focus:border-[#d4a843] text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1 font-bold">Rol</label>
                <select
                  value={usuarioEditando.rol}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
                  className="w-full bg-[#222] text-white rounded-xl px-3.5 py-2.5 border border-white/15 focus:outline-none focus:border-[#d4a843] text-xs"
                >
                  <option value="CAJERO">Cajero</option>
                  <option value="COCINERO">Cocinero</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="GERENTE">Gerente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1 font-bold">Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  value={usuarioEditando.password}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, password: e.target.value })}
                  placeholder="Dejar en blanco para mantener actual"
                  className="w-full bg-[#222] text-white rounded-xl px-3.5 py-2.5 border border-white/15 focus:outline-none focus:border-[#d4a843] text-xs"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setUsuarioEditando(null)}
                  className="flex-1 py-2.5 border border-white/15 text-white/70 rounded-xl text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#E84A5F] text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
