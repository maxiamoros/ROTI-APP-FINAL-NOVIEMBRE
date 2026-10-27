import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ConfigTotem() {
  const { token, user } = useAuth();
  
  const [welcomeMessage, setWelcomeMessage] = useState('TOCA LA PANTALLA PARA COMENZAR');
  const [whitelistEmails, setWhitelistEmails] = useState('maxiamoros123@gmail.com');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resConf, resProd, resCat] = await Promise.all([
        fetch(`\/api/config`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`\/api/productos`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`\/api/categorias`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if(resConf.ok) {
        const conf = await resConf.json();
        if(conf.welcomeMessage) setWelcomeMessage(conf.welcomeMessage);
        if(conf.WHITELIST_EMAILS) setWhitelistEmails(conf.WHITELIST_EMAILS);
      }
      if(resProd.ok) setProductos(await resProd.json());
      if(resCat.ok) setCategorias(await resCat.json());
      
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch(`\/api/config/batch`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify([
          { clave: 'welcomeMessage', valor: welcomeMessage },
          { clave: 'WHITELIST_EMAILS', valor: whitelistEmails }
        ])
      });
      if(res.ok) alert('Configuración guardada exitosamente');
    } catch(err) {
      alert('Error guardando configuración');
    }
  };

  const toggleProducto = async (producto) => {
    try {
      const nuevoEstado = !producto.activo;
      const res = await fetch(`\/api/productos/${producto.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...producto, activo: nuevoEstado })
      });
      if(res.ok) {
        setProductos(prev => prev.map(p => p.id === producto.id ? { ...p, activo: nuevoEstado } : p));
      }
    } catch(err) {
      alert('Error al actualizar estado del producto');
    }
  };

  const toggleCategoria = async (categoria) => {
    try {
      const nuevoEstado = !categoria.activo;
      const res = await fetch(`\/api/categorias/${categoria.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...categoria, activo: nuevoEstado })
      });
      if(res.ok) {
        setCategorias(prev => prev.map(c => c.id === categoria.id ? { ...c, activo: nuevoEstado } : c));
      }
    } catch(err) {
      alert('Error al actualizar estado de la categoría');
    }
  };

  if(loading) return <div className="text-white p-8">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto text-white space-y-8 animate-in fade-in zoom-in duration-300">
      
      <div className="bg-roti-dark border border-[#3A4A51] rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-black text-roti-cream uppercase tracking-wide mb-6 flex items-center gap-3">
          <svg className="w-8 h-8 text-roti-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Configuración General del Tótem
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-roti-cream/80 font-bold mb-2">Mensaje del Salvapantallas (Idle)</label>
            <input 
              type="text" 
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full bg-[#1e272b] border border-[#3A4A51] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-roti-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-roti-cream/80 font-bold mb-2">Correos Autorizados (Login Google)</label>
            <p className="text-sm text-roti-cream/50 mb-2">Separa los correos con comas. Ejemplo: maxiamoros123@gmail.com, otro@gmail.com</p>
            <input 
              type="text" 
              value={whitelistEmails}
              onChange={(e) => setWhitelistEmails(e.target.value)}
              className="w-full bg-[#1e272b] border border-[#3A4A51] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-roti-primary transition-colors font-mono text-sm"
              placeholder="admin@gmail.com, empleado@gmail.com"
            />
          </div>
          
          <button 
            onClick={handleSaveConfig}
            className="px-6 py-3 bg-roti-primary hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Productos */}
        <div className="bg-roti-dark border border-[#3A4A51] rounded-2xl p-6 shadow-xl flex flex-col h-[600px]">
          <h2 className="text-xl font-bold text-roti-cream uppercase mb-4">Disponibilidad de Productos</h2>
          <p className="text-roti-cream/60 text-sm mb-6">Desactiva los productos que estén sin stock para ocultarlos del Tótem.</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {productos.map(p => (
              <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${p.activo ? 'bg-[#1e272b] border-[#3A4A51]' : 'bg-red-500/10 border-red-500/20 opacity-50'}`}>
                <div className="flex items-center gap-4">
                  {p.imagenUrl ? <img src={p.imagenUrl} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-[#3A4A51]" />}
                  <div>
                    <h4 className="font-bold">{p.nombre}</h4>
                    <span className="text-sm text-roti-secondary">{p.categoriaNombre}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleProducto(p)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${p.activo ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'}`}
                >
                  {p.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-roti-dark border border-[#3A4A51] rounded-2xl p-6 shadow-xl flex flex-col h-[600px]">
          <h2 className="text-xl font-bold text-roti-cream uppercase mb-4">Disponibilidad de Categorías</h2>
          <p className="text-roti-cream/60 text-sm mb-6">Desactiva categorías enteras para que desaparezcan de la barra superior del Tótem.</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {categorias.map(c => (
              <div key={c.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${c.activo !== false ? 'bg-[#1e272b] border-[#3A4A51]' : 'bg-red-500/10 border-red-500/20 opacity-50'}`}>
                <div>
                  <h4 className="font-bold text-lg">{c.nombre}</h4>
                </div>
                <button 
                  onClick={() => toggleCategoria(c)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${c.activo !== false ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'}`}
                >
                  {c.activo !== false ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
