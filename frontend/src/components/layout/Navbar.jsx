import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navLinks = [
    { name: 'Caja', path: '/caja' },
    { name: 'Cocina KDS', path: '/cocina' },
    { name: 'Productos', path: '/productos' },
    { name: 'Inventario', path: '/inventario' },
    { name: 'Reportes', path: '/reportes' },
    { name: 'Config Tótem', path: '/admin/totem' },
    { name: 'IA ✦', path: '/admin/ia', isHighlight: true },
  ];

  if (user?.rol === 'TOTEM' || user?.rol === 'CLIENTE') {
    return null;
  }

  return (
    <>
      <header className="navbar-admin shadow-md relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + Hamburger Button on mobile */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                aria-label="Abrir menú de navegación"
                title="Menú"
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[#d4a843]/20 hover:border-[#d4a843]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] transition-all cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2 bg-[#d4a843]' : ''}`} />
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2 bg-[#d4a843]' : ''}`} />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d4a843]/60 group-hover:border-[#d4a843] transition-colors shadow-md">
                  <img src="/roti_logo.jpg" alt="La Rotisería" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-script text-lg text-[#d4a843] leading-none">La Rotisería</span>
                  <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Administración</span>
                </div>
              </Link>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      link.isHighlight
                        ? 'bg-[#ff8c00]/10 text-[#ff8c00] border border-[#ff8c00]/20 hover:bg-[#ff8c00]/20 hover:text-orange-300'
                        : isActive
                        ? 'bg-[#3A4A51] text-roti-cream'
                        : 'text-roti-cream/60 hover:bg-[#3A4A51] hover:text-roti-cream'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              {/* Landing link */}
              <Link
                to="/"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#d4a843]/70 border border-[#d4a843]/20 hover:border-[#d4a843]/50 hover:text-[#d4a843] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Inicio
              </Link>

              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-roti-cream">{user?.username || 'Usuario'}</span>
                <span className="text-xs font-semibold text-orange-400 bg-[#ff8c00]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{user?.rol || 'Invitado'}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#4A5E68] flex items-center justify-center border-2 border-[#4A5E68]">
                <span className="text-roti-cream/80 font-medium uppercase">{user?.username?.substring(0,2) || 'US'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-roti-cream/60 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-[#3A4A51] cursor-pointer"
                title="Salir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Backdrop */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer Panel Sólido (#121212) */}
      <aside
        id="admin-sidebar-drawer"
        className={`sidebar-drawer fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-[#121212] z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#121212', opacity: 1 }}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#d4a843]/20 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4a843] shadow-md">
              <img src="/roti_logo.jpg" alt="La Rotisería" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-script text-xl text-[#d4a843] leading-none">La Rotisería</span>
              <span className="text-[9px] font-bold text-white/50 tracking-widest uppercase mt-0.5">Administración</span>
            </div>
          </div>

          {/* Close Icon (X) */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="w-9 h-9 rounded-full bg-white/5 border border-[#d4a843]/40 flex items-center justify-center text-[#d4a843] hover:text-white hover:bg-[#d4a843]/30 hover:border-[#d4a843] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between bg-[#121212]">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all flex items-center justify-between ${
                    link.isHighlight
                      ? 'bg-[#ff8c00]/15 text-[#ff8c00] border border-[#ff8c00]/30 hover:bg-[#ff8c00]/25'
                      : isActive
                      ? 'bg-[#d4a843]/20 text-[#d4a843] border border-[#d4a843]/40'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-[#d4a843] opacity-60">→</span>
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-[#d4a843]/15 flex flex-col gap-3 bg-[#121212]">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#d4a843] border border-[#d4a843]/30 hover:bg-[#d4a843]/10 transition-colors"
            >
              Ver Sitio Principal
            </Link>
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
