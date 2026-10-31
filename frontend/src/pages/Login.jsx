import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, token } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al panel correspondiente
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) {
      if (user?.rol === 'COCINERO') navigate('/cocina', { replace: true });
      else if (user?.rol === 'CAJERO') navigate('/caja', { replace: true });
      else if (user?.rol === 'TOTEM' || user?.rol === 'CLIENTE') navigate('/cliente', { replace: true });
      else navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanUser = username.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setError(data.error || 'Usuario o contraseña incorrectos');
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      login(data.user, data.token);

      if (data.user?.rol === 'COCINERO') navigate('/cocina', { replace: true });
      else if (data.user?.rol === 'CAJERO') navigate('/caja', { replace: true });
      else if (data.user?.rol === 'TOTEM' || data.user?.rol === 'CLIENTE') navigate('/cliente', { replace: true });
      else navigate('/admin', { replace: true });
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#080808]">

      {/* Background texture + glow */}
      <div className="absolute inset-0 bg-stone-texture" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff8c00]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#d4a843]/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">

        {/* Logo header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-[#d4a843] shadow-[0_0_40px_rgba(212,168,67,0.4)] mb-5">
            <img src="/roti_logo.jpg" alt="La Rotisería Anti" className="w-full h-full object-cover" />
          </div>
          <p className="font-script text-3xl text-[#d4a843] leading-none mb-1">La Rotisería</p>
          <span className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase">Panel de Gestión</span>
        </div>

        {/* Form card */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">

          <h1 className="font-serif-display text-2xl font-bold text-white text-center mb-1">
            Acceso Privado
          </h1>
          <p className="text-white/40 text-sm text-center mb-8">
            Solo personal autorizado
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" id="admin-login-form">
            {/* Usuario */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-white/50 uppercase">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff8c00]/60 focus:ring-1 focus:ring-[#ff8c00]/30 transition-all placeholder:text-white/20 text-sm"
                  placeholder="Ingresá tu usuario"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-white/50 uppercase">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 text-white pl-11 pr-12 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff8c00]/60 focus:ring-1 focus:ring-[#ff8c00]/30 transition-all placeholder:text-white/20 text-sm"
                  placeholder="Ingresá tu contraseña"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-orange-cta py-4 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                  </svg>
                  Ingresar al Panel
                </>
              )}
            </button>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase font-bold tracking-wider">O</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="flex justify-center mt-2">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setError('');
                  setLoading(true);
                  try {
                    const res = await fetch('/api/auth/google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ credential: credentialResponse.credential })
                    });
                    const data = await res.json();
                    
                    if (!res.ok) {
                      throw new Error(data.error || 'Error de Google Auth');
                    }
                    
                    login(data.user, data.token);
                    navigate('/admin', { replace: true });
                  } catch (err) {
                    setError(err.message);
                    localStorage.removeItem('isAuthenticated');
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => {
                  setError('Falló la conexión con Google');
                }}
                theme="filled_black"
                text="signin_with"
                shape="pill"
              />
            </div>
          </form>
        </div>

        {/* Back to public site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
