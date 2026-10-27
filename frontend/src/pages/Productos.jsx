import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// 
// HELPERS
// 
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const COLORES_CATEGORIA = {
  Empanadas:    'orange',
  Pizzas:       'red',
  Pollos:       'amber',
  Guarniciones: 'lime',
  Bebidas:      'sky',
  Postres:      'pink',
};

const badgeClass = (catNombre) => {
  const c = COLORES_CATEGORIA[catNombre] || 'slate';
  const map = {
    orange: 'bg-roti-secondary/15 text-orange-300 border-orange-500/25',
    red:    'bg-roti-primary/15 text-red-300 border-red-500/25',
    amber:  'bg-amber-500/15 text-amber-300 border-amber-500/25',
    lime:   'bg-lime-500/15 text-lime-300 border-lime-500/25',
    sky:    'bg-sky-500/15 text-sky-300 border-sky-500/25',
    pink:   'bg-pink-500/15 text-pink-300 border-pink-500/25',
    slate:  'bg-slate-600/30 text-roti-cream/80 border-[#4A5E68]/30',
  };
  return map[c] || map.slate;
};

// 
// MODAL: Formulario de producto (crear / editar)
// 
const FORM_VACIO = { nombre: '', precio: '', imagenUrl: '', archivoImagen: null, categoriaId: '', receta: [] };

const ModalProducto = ({ producto, categorias, insumos, onGuardar, onCancelar }) => {
  const esEdicion = !!producto;
  const [form, setForm] = useState(
    esEdicion
      ? { 
          ...producto, 
          precio: String(producto.precio), 
          categoriaId: producto.categoriaId || '',
          archivoImagen: null,
          receta: producto.receta ? producto.receta.map(r => ({ insumoId: r.insumoId, cantidad: String(r.cantidad) })) : []
        }
      : { ...FORM_VACIO }
  );
  const [errores, setErrores] = useState({});

  const set = (campo, val) => {
    setForm((f) => ({ ...f, [campo]: val }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const agregarInsumo = () => {
    setForm(f => ({ ...f, receta: [...f.receta, { insumoId: '', cantidad: '1' }] }));
  };

  const cambiarInsumo = (index, campo, valor) => {
    const nuevaReceta = [...form.receta];
    nuevaReceta[index][campo] = valor;
    setForm(f => ({ ...f, receta: nuevaReceta }));
  };

  const quitarInsumo = (index) => {
    const nuevaReceta = [...form.receta];
    nuevaReceta.splice(index, 1);
    setForm(f => ({ ...f, receta: nuevaReceta }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0)
      e.precio = 'Ingresá un precio válido mayor a 0';
    // Validar receta
    for (let r of form.receta) {
      if (!r.insumoId) e.receta = 'Selecciona un insumo en todos los campos';
      if (!r.cantidad || isNaN(Number(r.cantidad)) || Number(r.cantidad) <= 0) e.receta = 'Cantidad inválida en receta';
    }
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) { setErrores(e); return; }
    onGuardar({ ...form, precio: Number(form.precio) });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#3A4A51] rounded-2xl border border-[#4A5E68] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#4A5E68] flex items-center justify-between">
          <h2 className="text-lg font-bold text-roti-cream">
            {esEdicion ? '️ Editar producto' : ' Nuevo producto'}
          </h2>
          <button onClick={onCancelar} className="text-roti-cream/60 hover:text-roti-cream transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="prod-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  placeholder="Ej: Empanada Carne"
                  className={`w-full bg-roti-dark border rounded-xl px-3 py-2.5 text-roti-cream text-sm
                              placeholder-slate-600 focus:outline-none transition-colors
                              ${errores.nombre
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500/30'
                                : 'border-[#4A5E68] focus:border-orange-500'}`}
                />
                {errores.nombre && <p className="text-xs text-red-400 mt-1">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
                  Imagen del Producto
                </label>
                
                {/* Vista previa */}
                {(form.archivoImagen || form.imagenUrl) && (
                  <div className="mb-3 relative inline-block">
                    <img 
                      src={form.archivoImagen ? URL.createObjectURL(form.archivoImagen) : (form.imagenUrl.startsWith('/uploads') ? `\${form.imagenUrl}` : form.imagenUrl)} 
                      alt="Preview" 
                      className="h-24 rounded-lg object-cover border border-[#4A5E68]"
                    />
                    <button type="button" onClick={() => { set('archivoImagen', null); set('imagenUrl', ''); }} className="absolute -top-2 -right-2 bg-roti-primary text-roti-cream rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-roti-primary">×</button>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  {/* Archivo local */}
                  <div className="flex items-center">
                    <label className="flex-1 cursor-pointer bg-roti-dark border border-[#4A5E68] border-dashed rounded-xl px-3 py-2 text-center text-sm text-roti-cream/60 hover:text-orange-400 hover:border-orange-500 transition-colors">
                      <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zM10 5.25a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 0110 5.25z" clipRule="evenodd"/></svg>
                        Subir foto desde PC
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            set('archivoImagen', e.target.files[0]);
                            set('imagenUrl', '');
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  {/* URL Externa */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-roti-cream/50">o usa URL:</span>
                    <input
                      type="url"
                      value={form.imagenUrl || ''}
                      onChange={(e) => { set('imagenUrl', e.target.value); set('archivoImagen', null); }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1 bg-roti-dark border border-[#4A5E68] rounded-lg px-3 py-2 text-roti-cream text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
                Precio (ARS) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-roti-cream/60 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={form.precio}
                  onChange={(e) => set('precio', e.target.value)}
                  placeholder="0"
                  min="1"
                  className={`w-full bg-roti-dark border rounded-xl pl-7 pr-3 py-2.5 text-roti-cream text-sm
                              placeholder-slate-600 focus:outline-none transition-colors
                              ${errores.precio
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500/30'
                                : 'border-[#4A5E68] focus:border-orange-500'}`}
                />
              </div>
              {errores.precio && <p className="text-xs text-red-400 mt-1">{errores.precio}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <select
                value={form.categoriaId}
                onChange={(e) => set('categoriaId', e.target.value)}
                className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2.5 text-roti-cream text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Sin categoría --</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* Constructor de Recetas */}
            <div className="bg-roti-dark/50 rounded-xl p-4 border border-[#4A5E68]">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider">
                  Receta / Insumos
                </label>
                <button type="button" onClick={agregarInsumo}
                  className="text-xs bg-roti-primary/20 text-orange-400 px-2 py-1 rounded hover:bg-roti-primary hover:text-roti-cream transition-colors">
                  + Agregar Insumo
                </button>
              </div>
              {errores.receta && <p className="text-xs text-red-400 mb-2">{errores.receta}</p>}
              
              <div className="space-y-2">
                {form.receta.map((r, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={r.insumoId}
                      onChange={(e) => cambiarInsumo(i, 'insumoId', e.target.value)}
                      className="flex-1 bg-[#3A4A51] border border-[#4A5E68] rounded-lg px-2 py-1.5 text-xs text-roti-cream"
                    >
                      <option value="">Select Insumo</option>
                      {insumos.map(ins => (
                        <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={r.cantidad}
                      onChange={(e) => cambiarInsumo(i, 'cantidad', e.target.value)}
                      step="0.01"
                      className="w-20 bg-[#3A4A51] border border-[#4A5E68] rounded-lg px-2 py-1.5 text-xs text-roti-cream"
                      placeholder="Cant."
                    />
                    <button type="button" onClick={() => quitarInsumo(i)} className="text-red-400 hover:text-red-300">
                      ×
                    </button>
                  </div>
                ))}
                {form.receta.length === 0 && (
                  <p className="text-xs text-roti-cream/50 italic">No se agregaron insumos. Este producto no descontará stock.</p>
                )}
              </div>
            </div>

          </form>
        </div>

        <div className="border-t border-[#4A5E68] p-6 flex gap-3">
          <button type="button" onClick={onCancelar}
            className="flex-1 py-2.5 rounded-xl border border-[#4A5E68] text-roti-cream/80 hover:bg-[#4A5E68] text-sm font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" form="prod-form"
            className="flex-1 py-2.5 rounded-xl bg-roti-primary hover:bg-roti-secondary text-roti-cream text-sm font-bold transition-colors">
            {esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 
// TOAST
// 
const Toast = ({ msg, tipo = 'success', onClose }) => {
  const config = {
    success: { bg: 'bg-emerald-700', shadow: 'shadow-emerald-900/40', icon: '' },
    error:   { bg: 'bg-red-700',     shadow: 'shadow-red-900/40',     icon: '' },
    info:    { bg: 'bg-[#4A5E68]',   shadow: 'shadow-slate-900/40',   icon: '️' },
  }[tipo];
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${config.bg} text-roti-cream
                    px-5 py-3.5 rounded-xl shadow-xl ${config.shadow} max-w-xs`}>
      <span className="text-lg">{config.icon}</span>
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose} className="ml-auto text-roti-cream/70 hover:text-roti-cream text-lg leading-none">×</button>
    </div>
  );
};

// 
// TARJETA DE PRODUCTO
// 
const ProductoCard = ({ producto, onEditar, onEliminar }) => (
  <div className={`group relative bg-[#3A4A51] border rounded-xl p-4 transition-all duration-200 hover:border-[#4A5E68] hover:shadow-lg border-[#4A5E68]`}>
    
    {/* Contenido */}
    <div className="flex items-start gap-3 mb-3">
      {producto.imagenUrl ? (
        <img src={producto.imagenUrl.startsWith('/uploads') ? `\${producto.imagenUrl}` : producto.imagenUrl} alt={producto.nombre} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-roti-dark border border-[#4A5E68]" />
      ) : (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#4A5E68] text-roti-cream/60 flex-shrink-0 text-xs text-center p-1">
          Sin imagen
        </div>
      )}
      <div className="min-w-0 pr-14">
        <h3 className="text-sm font-semibold text-roti-cream leading-tight truncate">{producto.nombre}</h3>
        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${badgeClass(producto.categoriaNombre)}`}>
          {producto.categoriaNombre}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <p className="text-lg font-bold text-orange-400">{formatPeso(producto.precio)}</p>

      {/* Acciones */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEditar(producto)} title="Editar"
          className="p-1.5 rounded-lg text-roti-cream/60 hover:bg-[#4A5E68] hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"/><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"/></svg>
        </button>
        <button onClick={() => onEliminar(producto)} title="Eliminar"
          className="p-1.5 rounded-lg text-roti-cream/60 hover:bg-roti-primary/10 hover:text-red-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd"/></svg>
        </button>
      </div>
    </div>
  </div>
);

// 
// PÁGINA PRINCIPAL
// 
const Productos = () => {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [ordenPor, setOrdenPor] = useState('nombre');
  const [modalEditar, setModalEditar] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTodo = async () => {
    try {
      const [resProd, resCat, resIns] = await Promise.all([
        fetch(`\/api/productos`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`\/api/categorias`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`\/api/insumos`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      if(resProd.ok) setProductos(await resProd.json());
      if(resCat.ok) setCategorias(await resCat.json());
      if(resIns.ok) setInsumos(await resIns.json());
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [token]);

  const handleGuardar = async (datos) => {
    try {
      let finalImageUrl = datos.imagenUrl;
      
      // Si hay un archivo, lo subimos primero
      if (datos.archivoImagen) {
        const formData = new FormData();
        formData.append('image', datos.archivoImagen);
        
        const uploadRes = await fetch(`/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Error al subir la imagen');
        
        finalImageUrl = uploadData.url;
      }
      
      const dataAEnviar = { ...datos, imagenUrl: finalImageUrl };
      delete dataAEnviar.archivoImagen;

      const isEdit = !!dataAEnviar.id;
      const url = isEdit ? `/api/productos/${dataAEnviar.id}` : `/api/productos`;
      const method = isEdit ? 'PUT' : 'POST';
      
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataAEnviar)
        });
        if (!res.ok) throw new Error('Error al guardar en servidor');
      } catch (e) {
        console.warn('[Productos] Backend no respondió, guardando localmente');
      }

      // Persistir localmente y sincronizar en tiempo real con la tienda pública
      const guardados = leerProductos();
      let nuevaLista = [];
      if (isEdit) {
        nuevaLista = guardados.map(p => p.id === dataAEnviar.id ? { ...p, ...dataAEnviar } : p);
      } else {
        nuevaLista = [dataAEnviar, ...guardados];
      }
      guardarProductos(nuevaLista);
      window.dispatchEvent(new Event('rotiseria_productos_updated'));
      window.dispatchEvent(new Event('storage'));

      mostrarToast(`Producto ${isEdit ? 'actualizado' : 'creado'} correctamente`);
      setModalEditar(null);
      fetchTodo();
    } catch(err) {
      mostrarToast(err.message, 'error');
    }
  };

  const eliminarProducto = async (id) => {
    if(!window.confirm('¿Eliminar producto?')) return;
    try {
      const res = await fetch(`\/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(!res.ok) throw new Error('Error al eliminar');
      mostrarToast('Producto eliminado', 'info');
      fetchTodo();
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => {
      const matchCat  = categoriaActiva === 'Todas' || p.categoriaNombre === categoriaActiva;
      const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchBusq;
    });

    lista = [...lista].sort((a, b) => {
      if (ordenPor === 'precio_asc')  return a.precio - b.precio;
      if (ordenPor === 'precio_desc') return b.precio - a.precio;
      if (ordenPor === 'categoria')   return a.categoriaNombre.localeCompare(b.categoriaNombre);
      return a.nombre.localeCompare(b.nombre);
    });

    return lista;
  }, [productos, categoriaActiva, busqueda, ordenPor]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-roti-cream tracking-tight">Gestión de Productos</h1>
          <p className="mt-1 text-roti-cream/60 text-sm">Administra tu menú y asigna recetas para el inventario.</p>
        </div>
        <button onClick={() => setModalEditar('nuevo')}
          className="flex items-center gap-2 px-4 py-2.5 bg-roti-primary hover:bg-roti-secondary text-roti-cream font-semibold rounded-xl text-sm transition-colors shadow-lg active:scale-95">
          + Nuevo producto
        </button>
      </div>

      <div className="bg-[#3A4A51]/60 rounded-xl border border-[#4A5E68] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre..."
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl pl-4 pr-3 py-2 text-sm text-roti-cream focus:border-orange-500 transition-colors" />
          </div>
          <select value={ordenPor} onChange={(e) => setOrdenPor(e.target.value)}
            className="bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-sm text-roti-cream/80 focus:border-orange-500 transition-colors">
            <option value="nombre">Ordenar: Nombre A-Z</option>
            <option value="precio_asc">Ordenar: Precio </option>
            <option value="precio_desc">Ordenar: Precio </option>
            <option value="categoria">Ordenar: Categoría</option>
          </select>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {['Todas', ...categorias.map(c => c.nombre)].map((cat) => {
            const count = cat === 'Todas' ? productos.length : productos.filter((p) => p.categoriaNombre === cat).length;
            const emoji = cat === 'Todas' ? '' : categorias.find(c => c.nombre === cat)?.emoji;
            return (
              <button key={cat} onClick={() => setCategoriaActiva(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  categoriaActiva === cat ? 'bg-roti-secondary border-orange-500 text-roti-cream' : 'bg-[#3A4A51] border-[#4A5E68] text-roti-cream/60 hover:text-roti-cream'
                }`}>
                {cat} <span className="bg-[#4A5E68] px-1.5 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-roti-cream/50">
          <p className="text-base font-medium text-roti-cream/60">No hay productos que coincidan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {productosFiltrados.map((p) => (
            <ProductoCard key={p.id} producto={p} onEditar={setModalEditar} onEliminar={() => eliminarProducto(p.id)} />
          ))}
        </div>
      )}

      {modalEditar && (
        <ModalProducto
          producto={modalEditar === 'nuevo' ? null : modalEditar}
          categorias={categorias}
          insumos={insumos}
          onGuardar={handleGuardar}
          onCancelar={() => setModalEditar(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Productos;
