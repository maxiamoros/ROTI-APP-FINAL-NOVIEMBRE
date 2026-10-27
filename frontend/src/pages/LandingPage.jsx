import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingChatWidget from '../components/chat/FloatingChatWidget';

// ─── DATA: Slides del Hero ─────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    category: 'Milanesas',
    title: '¡Los platos más exquisitos!',
    subtitle: 'Bienvenido a La Rotisería',
    description: 'Milanesa Napolitana con papas fritas doradas, tomate y aceitunas. El clásico argentino en su máxima expresión.',
    image: '/milanesa_hero.jpg',
    badge: '⭐ Plato del Día',
    color: '#ff8c00',
  },
  {
    id: 2,
    category: 'Pizzas',
    title: 'Pizzas artesanales',
    subtitle: 'Recién salidas del horno',
    description: 'Masa gruesa y crujiente con mozzarella abundante, aceitunas y albahaca fresca. Tradición italiana en cada bocado.',
    image: '/pizza_hero.jpg',
    badge: '🔥 Favorita',
    color: '#e84a5f',
  },
  {
    id: 3,
    category: 'Pollos',
    title: 'Pollos al espiedo',
    subtitle: 'Dorados y jugosos',
    description: 'Pollo entero cocido lentamente al espiedo con hierbas aromáticas y papas asadas. Tradición rotisería argentina.',
    image: '/pollo_hero.jpg',
    badge: '👑 El Clásico',
    color: '#d4a843',
  },
];

// ─── Navbar de Landing ─────────────────────────────────────────────────────────
const LandingNavbar = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // type: 'hash' → scroll suave en la misma página | 'route' → navega con React Router
  const publicLinks = [
    { name: 'INICIO',          href: '#inicio',         type: 'hash'  },
    { name: 'ESPECIALIDADES',  href: '#especialidades',  type: 'hash'  },
    { name: 'SERVICIOS',       href: '#servicios',       type: 'hash'  },
    { name: 'DELIVERY',        href: '/cliente',         type: 'route' },
    { name: 'GALERÍA',         href: '#galeria',         type: 'hash'  },
    { name: 'CONTACTO',        href: '#contacto',        type: 'hash'  },
    { name: 'PANEL ADMIN',     href: '/admin/login',     type: 'route', isAdmin: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'navbar-glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* ── Logo Circular Vintage ── */}
            <a href="#inicio" className="flex-shrink-0 group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d4a843] shadow-[0_0_20px_rgba(212,168,67,0.4)] group-hover:shadow-[0_0_30px_rgba(212,168,67,0.7)] transition-all duration-300 group-hover:scale-105">
                <img
                  src="/roti_logo.jpg"
                  alt="La Rotisería Anti"
                  className="w-full h-full object-cover"
                />
              </div>
            </a>

            {/* ── Nav Links Desktop ── */}
            <nav className="hidden xl:flex items-center gap-1">
              {publicLinks.filter((l) => !l.isAdmin).map((link) =>
                link.type === 'route' ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="nav-link px-3 py-2 text-xs font-semibold tracking-widest text-white/80 hover:text-[#ff8c00] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="nav-link px-3 py-2 text-xs font-semibold tracking-widest text-white/80 hover:text-[#ff8c00] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                )
              )}
            </nav>

            {/* ── CTA Button + Admin Direct Link + Hamburger Menu ── */}
            <div className="flex items-center gap-3">
              {/* Direct Desktop Admin Link */}
              <Link
                to="/admin/login"
                aria-label="Ir al panel de administración"
                title="Acceso Administración"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold tracking-widest text-[#d4a843] bg-[#d4a843]/10 hover:bg-[#d4a843]/20 border border-[#d4a843]/30 hover:border-[#d4a843]/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]"
              >
                <svg className="w-3.5 h-3.5 text-[#d4a843]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>PANEL ADMIN</span>
              </Link>

              <Link
                to="/cliente"
                id="cta-pedido-btn"
                className="btn-orange-cta hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm tracking-wide whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Hace tu Pedido
              </Link>

              {/* Hamburger Button (Siempre Visible en todas las resoluciones) */}
              <button
                id="mobile-menu-btn"
                aria-label="Abrir menú de navegación"
                title="Menú"
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#d4a843]/20 hover:border-[#d4a843]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] transition-all cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2 bg-[#d4a843]' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2 bg-[#d4a843]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Overlay Backdrop ── */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Sidebar / Drawer Panel Sólido (#121212) ── */}
      <aside
        id="sidebar-drawer"
        className={`sidebar-drawer fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-[#121212] z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
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
              <span className="text-[9px] font-bold text-white/50 tracking-widest uppercase mt-0.5">Menú Principal</span>
            </div>
          </div>

          {/* Close Icon (X) */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="w-9 h-9 rounded-full bg-white/5 border border-[#d4a843]/40 flex items-center justify-center text-[#d4a843] hover:text-white hover:bg-[#d4a843]/30 hover:border-[#d4a843] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between bg-[#121212]">
          <nav className="flex flex-col gap-2">
            {publicLinks.map((link) =>
              link.type === 'route' ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-label={link.isAdmin ? "Ir al panel de administración" : undefined}
                  className={`px-4 py-3.5 rounded-xl text-sm font-semibold tracking-widest transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] ${
                    link.isAdmin
                      ? 'text-[#d4a843] bg-[#d4a843]/10 border border-[#d4a843]/30 hover:bg-[#d4a843]/20 hover:border-[#d4a843]/60 font-bold mt-2'
                      : 'text-white hover:text-[#d4a843] hover:bg-[#d4a843]/10 border border-transparent hover:border-[#d4a843]/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isAdmin && (
                      <svg className="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                    {link.name}
                  </span>
                  <span className="text-[#d4a843] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-sm font-semibold tracking-widest text-white hover:text-[#d4a843] hover:bg-[#d4a843]/10 border border-transparent hover:border-[#d4a843]/20 transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#d4a843] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </a>
              )
            )}
          </nav>

          {/* Drawer Footer CTA */}
          <div className="pt-6 border-t border-[#d4a843]/15 flex flex-col gap-4 bg-[#121212]">
            <Link
              to="/cliente"
              onClick={() => setMenuOpen(false)}
              className="btn-orange-cta w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-bold text-sm shadow-xl tracking-wide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Hace tu Pedido
            </Link>
            <div className="text-center text-xs text-white/40">
              La Rotisería &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// ─── Hero Slider ───────────────────────────────────────────────────────────────
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-stone-texture">
      {/* Background image with animated transition */}
      <div className="absolute inset-0 z-0">
        <div
          key={`bg-${current}`}
          className="absolute inset-0 animate-slide-transition"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Floating flour/spice particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${10 + (i % 3) * 15}%`,
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(212,168,67,0.2)',
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
          {/* ── Left Content ── */}
          <div key={`content-${current}`} className="animate-slide-in-left">
            {/* Category badge */}
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border"
              style={{
                color: slide.color,
                borderColor: slide.color + '50',
                background: slide.color + '15',
              }}
            >
              {slide.badge}
              <span className="w-px h-3 bg-current opacity-40" />
              {slide.category}
            </span>

            {/* Cursive subtitle */}
            <p
              className="font-script text-4xl md:text-5xl mb-3 leading-none"
              style={{ color: '#d4a843' }}
            >
              {slide.subtitle}
            </p>

            {/* Main title */}
            <h1 className="font-serif-display text-4xl md:text-5xl xl:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/cliente"
                id={`hero-ver-menu-${current}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#ff8c00] font-bold text-base tracking-wide hover:bg-[#ff8c00] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(255,140,0,0.4)] hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                VER MENÚ
              </Link>
              <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-base tracking-wide hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pedir por WhatsApp
              </a>
            </div>

            {/* Slide dots */}
            <div className="flex items-center gap-2 mt-12">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  id={`slider-dot-${i}`}
                  onClick={() => goTo(i)}
                  className={`slider-dot ${i === current ? 'active' : ''}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
              <span className="ml-4 text-white/40 text-sm font-mono">
                {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── Right Content: Dish Image ── */}
          <div
            key={`img-${current}`}
            className="hidden lg:flex items-center justify-center animate-slide-in-right"
          >
            <div className="relative">
              {/* Glow ring behind plate */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-90 animate-pulse"
                style={{ background: slide.color }}
              />
              {/* White plate circle */}
              <div className="relative w-[420px] h-[420px] xl:w-[500px] xl:h-[500px] rounded-full overflow-hidden border-[6px] border-white/90 shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.1)] animate-float">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover scale-110 object-center"
                />
              </div>
              {/* Category label floating */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-bold text-white text-sm tracking-widest uppercase shadow-xl"
                style={{ background: `linear-gradient(135deg, ${slide.color}, ${slide.color}cc)` }}
              >
                {slide.category}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Arrow Controls ── */}
      <button
        id="slider-prev-btn"
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-[#ff8c00]/80 hover:border-[#ff8c00] transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        id="slider-next-btn"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-[#ff8c00]/80 hover:border-[#ff8c00] transition-all duration-300 hover:scale-110"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase font-semibold">Explorar</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
};

// ─── Sección Especialidades ────────────────────────────────────────────────────
const EspecialidadesSection = () => {
  const items = [
    { icon: '🥩', title: 'Milanesas', desc: 'Napolitanas, con jamón y queso, a la portuguesa. La tradición en su máxima expresión.' },
    { icon: '🍕', title: 'Pizzas', desc: 'Masa artesanal, abundante mozzarella. Muzzarella, fugazzeta, especiales de la casa.' },
    { icon: '🍗', title: 'Pollos al Espiedo', desc: 'Dorados y jugosos. El clásico de rotisería que todos esperan.' },
    { icon: '🥟', title: 'Empanadas', desc: 'Rellenas, jugosas, con masa casera. Carne, pollo, jamón y queso.' },
  ];

  return (
    <section id="especialidades" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff8c00]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a843]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-script text-3xl text-[#d4a843] mb-2">Nuestra Cocina</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white mb-4">
            Especialidades de la Casa
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/3 border border-white/8 rounded-3xl p-8 hover:border-[#ff8c00]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,140,0,0.15)] cursor-pointer overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff8c00]/0 to-[#ff8c00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

              <div className="relative z-10">
                <span className="text-5xl block mb-5">{item.icon}</span>
                <h3 className="font-serif-display text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff8c00] to-[#d4a843] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Sección Galería ───────────────────────────────────────────────────────────
const GaleriaSection = () => {
  const fotos = [
    { src: '/milanesa_hero.jpg', label: 'Milanesa Napolitana', sub: 'Con papas y aceitunas' },
    { src: '/pizza_hero.jpg',    label: 'Pizza Muzzarella',    sub: 'Masa artesanal, extra queso' },
    { src: '/pollo_hero.jpg',    label: 'Pollo al Espiedo',    sub: 'Dorado y jugoso' },
    { src: '/milanesa_hero.jpg', label: 'Empanadas',           sub: 'Docena recién horneada' },
  ];

  return (
    <section id="galeria" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Faint horizontal rule top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-script text-3xl text-[#d4a843] mb-2">Nuestros Platos</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white mb-4">
            Galería de Sabores
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent mx-auto" />
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {fotos.map((foto, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
            >
              <img
                src={foto.src}
                alt={foto.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-serif-display text-white font-bold text-lg leading-tight">{foto.label}</p>
                <p className="text-[#d4a843] text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{foto.sub}</p>
              </div>
              {/* Gold corner accent */}
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#d4a843]/0 group-hover:border-[#d4a843]/80 transition-colors duration-300 rounded-tr" />
            </div>
          ))}
        </div>

        {/* CTA ver menú completo */}
        <div className="text-center mt-12">
          <Link
            to="/cliente"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#ff8c00]/40 text-[#ff8c00] font-bold tracking-wide hover:bg-[#ff8c00]/10 hover:border-[#ff8c00] transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Ver menú completo
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Sección Servicios ─────────────────────────────────────────────────────────
const ServiciosSection = () => (
  <section id="servicios" className="py-24 bg-gradient-to-b from-[#0d0d0d] to-[#111111]">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <div className="text-center mb-16">
        <p className="font-script text-3xl text-[#d4a843] mb-2">Lo que ofrecemos</p>
        <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white mb-4">
          Nuestros Servicios
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            ),
            title: 'Local',
            desc: 'Retirá tu pedido en el local. Rápido, fresco y recién hecho.',
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            ),
            title: 'Delivery',
            desc: 'Llevamos tu pedido a domicilio. Rápido y en perfectas condiciones.',
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            ),
            title: 'Tótem Self-Service',
            desc: 'Pedí directamente desde nuestro tótem digital en el local. Sin esperas.',
          },
        ].map((s, i) => (
          <div
            key={i}
            className="group relative bg-white/3 border border-white/8 rounded-3xl p-10 text-center hover:border-[#d4a843]/40 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(212,168,67,0.1)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ff8c00]/10 border border-[#ff8c00]/20 flex items-center justify-center text-[#ff8c00] mx-auto mb-6 group-hover:bg-[#ff8c00]/20 transition-colors duration-300">
              {s.icon}
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Sección Contacto / Footer ─────────────────────────────────────────────────
const ContactoSection = () => (
  <section id="contacto" className="py-24 bg-[#080808] relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('/roti_logo.jpg')] bg-center bg-no-repeat opacity-[0.03] bg-[length:400px]" />

    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-script text-4xl text-[#d4a843] mb-3">Visitanos</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white mb-6">
            ¡Te esperamos!
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
            Encontranos en el corazón del barrio. Pedido por mostrador, delivery o tótem. Siempre fresco, siempre rico.
          </p>
          <div className="space-y-4">
            {[
              { icon: '📍', label: 'Dirección', val: 'Av. Principal 1234, Buenos Aires' },
              { icon: '🕐', label: 'Horario', val: 'Lun–Vie 10:00–22:00 / Sáb–Dom 11:00–23:00' },
              { icon: '📞', label: 'Teléfono', val: '+54 9 11 0000-0000' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-[#d4a843] text-xs font-semibold tracking-widest uppercase mb-1">{c.label}</p>
                  <p className="text-white/80 text-sm">{c.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-6">
          <img src="/roti_logo.jpg" alt="La Rotisería Anti" className="w-48 h-48 rounded-full border-4 border-[#d4a843]/40 shadow-[0_0_60px_rgba(212,168,67,0.2)]" />
          <Link
            to="/cliente"
            className="btn-orange-cta px-10 py-4 rounded-full text-white font-bold text-lg tracking-wide inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Pedir Ahora
          </Link>
          <p className="text-white/30 text-xs tracking-widest">© 2026 La Rotisería Anti. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </section>
);

// ─── Botón WhatsApp Flotante ───────────────────────────────────────────────────
const WhatsAppButton = () => (
  <a
    href="https://wa.me/5491100000000"
    target="_blank"
    rel="noopener noreferrer"
    id="whatsapp-float-btn"
    className="fixed bottom-28 right-6 z-50 w-14 h-14 btn-whatsapp rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.7)]"
    title="Contactar por WhatsApp"
  >
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

// ─── LandingPage principal ─────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      {/* Metadata */}
      <title>La Rotisería Anti — Tradición y Sabor Argentino</title>
      <meta name="description" content="La mejor rotisería de Buenos Aires. Milanesas, pizzas, pollos al espiedo y empanadas. Pedí online o vení a buscarlo." />

      {/* Navbar fijo */}
      <LandingNavbar scrolled={scrolled} />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Especialidades */}
      <EspecialidadesSection />

      {/* Galería */}
      <GaleriaSection />

      {/* Servicios */}
      <ServiciosSection />

      {/* Contacto */}
      <ContactoSection />

      {/* WhatsApp flotante */}
      <WhatsAppButton />

      {/* Widget IA Flotante (posición bottom-6 right-6) */}
      <FloatingChatWidget />
    </div>
  );
}
