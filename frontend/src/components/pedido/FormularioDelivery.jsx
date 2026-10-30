import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatPeso, validarDatosDelivery } from '../../utils/pedido';
import IconoWhatsApp from './IconoWhatsApp';

// Coordenadas centrales por defecto: San Rafael, Mendoza, Argentina
const SAN_RAFAEL_COORDS = { lat: -34.6177, lng: -68.3301 };

/** Definición de los campos del formulario manual */
const CAMPOS = [
  { name: 'nombre',   label: 'Nombre completo', placeholder: 'Ej: Juan Pérez',      type: 'text', autoComplete: 'name',          col: 'sm:col-span-3' },
  { name: 'calle',    label: 'Calle',           placeholder: 'Ej: Av. San Martín',  type: 'text', autoComplete: 'address-line1', col: 'sm:col-span-2' },
  { name: 'numero',   label: 'Número de casa',  placeholder: 'Ej: 1234',            type: 'text', autoComplete: 'off',           col: 'sm:col-span-1' },
  { name: 'telefono', label: 'Teléfono',        placeholder: 'Ej: 2604123456',      type: 'tel',  autoComplete: 'tel',           col: 'sm:col-span-3', inputMode: 'numeric' },
];

const DATOS_VACIOS = { nombre: '', calle: '', numero: '', telefono: '' };

// Ícono personalizado del pin (📍) con sombra, sin problemas de rutas de imágenes en Vite
const IconoPin = L.divIcon({
  className: 'delivery-custom-pin',
  html: `<div style="transform: translate(-50%, -100%); font-size: 34px; line-height: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.7)); user-select: none;">📍</div>`,
  iconSize: [0, 0],
});

/**
 * Formulario de entrega para Delivery con Mapa Interactivo (Leaflet / OpenStreetMap).
 * Permite:
 * - Mapa centrado en San Rafael, Mendoza, Argentina con pin arrastrable o tocable.
 * - Botón "Usar mi ubicación actual" vía navigator.geolocation.
 * - Buscador con autocompletado restringido a Argentina (Nominatim).
 * - Geocodificación inversa para autocompletar calle y número al mover el pin.
 * - Guardado de ubicación GPS con link a Google Maps.
 */
export default function FormularioDelivery({ total, onEnviar, onVolver }) {
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  // Estado del mapa y geolocalización
  const [posicionPin, setPosicionPin] = useState(SAN_RAFAEL_COORDS);
  const [cargandoGeo, setCargandoGeo] = useState(false);
  const [mensajeGeo, setMensajeGeo] = useState(null); // { tipo: 'exito' | 'error' | 'info', texto }
  const [direccionDetectada, setDireccionDetectada] = useState('');

  // Buscador de direcciones
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Referencias de Leaflet
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ── Geocodificación Inversa (lat/lng -> calle y número) ─────────────────────
  const realizarGeocodificacionInversa = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'es' },
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) return;
      const data = await res.json();
      if (!data?.address) return;

      const addr = data.address;
      const calleObtenida = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
      const numeroObtenido = addr.house_number || '';

      const nombreLugar = [calleObtenida, numeroObtenido, addr.city || addr.town || 'San Rafael']
        .filter(Boolean)
        .join(' ');

      if (nombreLugar) {
        setDireccionDetectada(nombreLugar);
      }

      // Auto-completamos los campos del formulario si están vacíos o el usuario los actualiza
      setDatos((prev) => ({
        ...prev,
        calle: calleObtenida || prev.calle,
        numero: numeroObtenido || prev.numero,
      }));
    } catch (_) {
      // Si falla la geocodificación inversa, el usuario aún puede ingresar manualmente
    }
  };

  // ── Mover el pin y centrar el mapa ──────────────────────────────────────────
  const moverPinYCentrar = (lat, lng, zoom = null) => {
    const nuevaPos = { lat, lng };
    setPosicionPin(nuevaPos);

    if (markerInstanceRef.current) {
      markerInstanceRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      if (zoom) {
        mapInstanceRef.current.setView([lat, lng], zoom);
      } else {
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }

    realizarGeocodificacionInversa(lat, lng);
  };

  // ── Inicialización de Leaflet ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Crear mapa centrado en San Rafael
    const map = L.map(mapContainerRef.current, {
      center: [SAN_RAFAEL_COORDS.lat, SAN_RAFAEL_COORDS.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Pin arrastrable
    const marker = L.marker([SAN_RAFAEL_COORDS.lat, SAN_RAFAEL_COORDS.lng], {
      icon: IconoPin,
      draggable: true,
    }).addTo(map);

    // Evento al arrastrar el pin
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setPosicionPin({ lat: pos.lat, lng: pos.lng });
      realizarGeocodificacionInversa(pos.lat, pos.lng);
    });

    // Evento al tocar o hacer clic en cualquier punto del mapa
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setPosicionPin({ lat: e.latlng.lat, lng: e.latlng.lng });
      realizarGeocodificacionInversa(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;

    // Invalida tamaño para asegurar carga completa de tiles dentro del modal
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 350);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
    };
  }, []);

  // ── Botón "Usar mi ubicación actual" (GPS) ──────────────────────────────────
  const handleUsarUbicacion = () => {
    if (!navigator.geolocation) {
      setMensajeGeo({
        tipo: 'error',
        texto: 'Tu navegador no soporta geolocalización. Podés buscar tu dirección o mover el pin en el mapa.',
      });
      return;
    }

    setCargandoGeo(true);
    setMensajeGeo(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCargandoGeo(false);
        const { latitude, longitude } = pos.coords;
        moverPinYCentrar(latitude, longitude, 16);
        setMensajeGeo({
          tipo: 'exito',
          texto: '📍 Ubicación detectada con éxito. Verificá que el pin esté sobre tu casa.',
        });
      },
      (err) => {
        setCargandoGeo(false);
        let msg = 'No pudimos acceder a tu ubicación actual.';
        if (err.code === 1) {
          msg = 'Permiso de ubicación denegado. Podés buscar tu dirección arriba o tocar el mapa para ubicar tu casa.';
        } else if (err.code === 2) {
          msg = 'La señal de ubicación no está disponible en este momento. Indicá tu punto en el mapa.';
        } else if (err.code === 3) {
          msg = 'Se agotó el tiempo esperando la ubicación. Podés mover el pin manualmente en el mapa.';
        }
        setMensajeGeo({ tipo: 'error', texto: msg });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // ── Buscador de Direcciones con Autocompletado (Nominatim Argentina) ────────
  const handleCambioBusqueda = (e) => {
    const query = e.target.value;
    setBusqueda(query);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!query || query.trim().length < 3) {
      setSugerencias([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Búsqueda restringida a Argentina con preferencia en Mendoza
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Mendoza, Argentina'
        )}&countrycodes=ar&limit=5&addressdetails=1`;

        const res = await fetch(url, {
          headers: { 'Accept-Language': 'es' },
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const items = await res.json();
          setSugerencias(Array.isArray(items) ? items : []);
        }
      } catch (_) {
        setSugerencias([]);
      } finally {
        setBuscando(false);
      }
    }, 400);
  };

  const seleccionarSugerencia = (sug) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    moverPinYCentrar(lat, lng, 16);

    const addr = sug.address || {};
    const calleSug = addr.road || addr.pedestrian || sug.display_name.split(',')[0] || '';
    const numSug = addr.house_number || '';

    setDatos((prev) => ({
      ...prev,
      calle: calleSug.trim(),
      numero: numSug.trim() || prev.numero,
    }));

    setBusqueda('');
    setSugerencias([]);
    setMensajeGeo({
      tipo: 'exito',
      texto: `📍 Punto fijado en: ${sug.display_name.split(',').slice(0, 2).join(',')}`,
    });
  };

  // ── Validación y Envío ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const nuevos = { ...datos, [e.target.name]: e.target.value };
    setDatos(nuevos);
    if (intentoEnviar) setErrores(validarDatosDelivery(nuevos));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIntentoEnviar(true);

    const errs = validarDatosDelivery(datos);
    setErrores(errs);

    const primerError = CAMPOS.find((c) => errs[c.name]);
    if (primerError) {
      document.getElementById(`delivery-${primerError.name}`)?.focus();
      return;
    }

    // Ubicación GPS fijada en el mapa
    const mapaUrl = `https://www.google.com/maps?q=${posicionPin.lat.toFixed(6)},${posicionPin.lng.toFixed(6)}`;

    onEnviar({
      nombre: datos.nombre.trim(),
      calle: datos.calle.trim(),
      numero: datos.numero.trim(),
      telefono: datos.telefono.trim(),
      coordenadas: posicionPin,
      mapaUrl,
    });
  };

  const cantidadErrores = Object.keys(errores).length;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-titulo"
    >
      <div className="min-h-full flex items-end sm:items-center justify-center sm:p-6 p-2">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="bg-[#181818] text-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/15 my-auto"
        >
          {/* Encabezado */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex gap-4 items-center bg-[#121212] flex-shrink-0">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-2xl bg-[#E84A5F]/15 border border-[#E84A5F]/30 flex items-center justify-center text-2xl sm:text-3xl"
              aria-hidden="true"
            >
              🛵
            </div>
            <div className="min-w-0">
              <h2
                id="delivery-titulo"
                className="text-base sm:text-xl font-bold text-white uppercase tracking-wide"
              >
                Datos para el Delivery
              </h2>
              <p className="text-white/50 text-xs mt-0.5">
                Total del pedido: <span className="text-[#FECEA8] font-black">{formatPeso(total)}</span>
              </p>
            </div>
          </div>

          {/* Cuerpo del formulario con Scroll */}
          <div className="p-4 sm:p-6 bg-[#181818] space-y-5 max-h-[75vh] overflow-y-auto">

            {/* Alerta de errores de validación */}
            {intentoEnviar && cantidadErrores > 0 && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm px-4 py-3"
              >
                <span aria-hidden="true">⚠️</span>
                <span>
                  Revisá{' '}
                  {cantidadErrores === 1
                    ? 'el campo marcado'
                    : `los ${cantidadErrores} campos marcados`}{' '}
                  para continuar.
                </span>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                SECCIÓN: MAPA INTERACTIVO DE ENTREGA
               ═══════════════════════════════════════════════════════════════════ */}
            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#d4a843] uppercase tracking-wider block">
                    📍 Ubicación exacta en el mapa
                  </span>
                  <p className="text-[11px] text-white/50">
                    Arrastrá el pin o tocá el mapa para marcar el punto exacto de entrega.
                  </p>
                </div>

                {/* Botón: Usar mi ubicación actual */}
                <button
                  type="button"
                  onClick={handleUsarUbicacion}
                  disabled={cargandoGeo}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 self-start sm:self-auto"
                >
                  <span>{cargandoGeo ? '⏳' : '🎯'}</span>
                  <span>{cargandoGeo ? 'Buscando...' : 'Usar mi ubicación actual'}</span>
                </button>
              </div>

              {/* Buscador con Autocompletado */}
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={handleCambioBusqueda}
                  placeholder="🔍 Buscar dirección en San Rafael / Mendoza..."
                  className="w-full bg-[#121212] border border-white/20 focus:border-[#d4a843] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none transition-colors"
                />
                {buscando && (
                  <span className="absolute right-3 top-2.5 text-xs text-white/40 animate-pulse">
                    Buscando...
                  </span>
                )}

                {/* Dropdown de Sugerencias */}
                {sugerencias.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#161616] border border-white/20 rounded-xl shadow-2xl z-[1000] overflow-hidden max-h-48 overflow-y-auto">
                    {sugerencias.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => seleccionarSugerencia(sug)}
                        className="w-full text-left px-4 py-2.5 text-xs text-white/80 hover:bg-[#d4a843]/20 hover:text-white border-b border-white/5 last:border-none transition-colors block"
                      >
                        📍 {sug.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mensajes de Estado de Ubicación */}
              {mensajeGeo && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                    mensajeGeo.tipo === 'exito'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
                  }`}
                >
                  <span>{mensajeGeo.tipo === 'exito' ? '✅' : 'ℹ️'}</span>
                  <span className="leading-snug">{mensajeGeo.texto}</span>
                </div>
              )}

              {/* Contenedor del Mapa Leaflet */}
              <div className="relative rounded-xl overflow-hidden border border-white/15 h-56 sm:h-64 z-0">
                <div ref={mapContainerRef} className="w-full h-full" />
                <div className="absolute bottom-2 left-2 bg-black/75 px-3 py-1 rounded-full text-[10px] text-white/70 backdrop-blur-xs pointer-events-none z-[400] flex items-center gap-1.5 border border-white/10">
                  <span>📍 San Rafael, Mendoza</span>
                  {direccionDetectada && (
                    <>
                      <span>•</span>
                      <span className="text-[#FECEA8] font-bold truncate max-w-[200px]">
                        {direccionDetectada}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                SECCIÓN: CAMPOS MANUALES DE DIRECCIÓN Y TELÉFONO
               ═══════════════════════════════════════════════════════════════════ */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest block">
                Datos personales y de entrega
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {CAMPOS.map((c) => {
                  const error = errores[c.name];
                  const id = `delivery-${c.name}`;
                  return (
                    <div key={c.name} className={c.col}>
                      <label
                        htmlFor={id}
                        className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5"
                      >
                        {c.label} <span className="text-[#E84A5F]">*</span>
                      </label>
                      <input
                        id={id}
                        name={c.name}
                        type={c.type}
                        inputMode={c.inputMode}
                        autoComplete={c.autoComplete}
                        placeholder={c.placeholder}
                        value={datos[c.name]}
                        onChange={handleChange}
                        required
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={`select-text w-full px-4 py-3 rounded-xl bg-white/5 text-white text-sm placeholder:text-white/25 border outline-none transition-colors ${
                          error
                            ? 'border-red-500/70 focus:border-red-400 bg-red-500/5'
                            : 'border-white/10 focus:border-[#d4a843]'
                        }`}
                      />
                      {error && (
                        <p id={`${id}-error`} className="text-red-400 text-[11px] font-semibold mt-1">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-white/40 text-[11px] leading-relaxed">
              Al confirmar se abrirá WhatsApp con el pedido listo, el detalle y el enlace con tu punto GPS exacto en el mapa.
            </p>
          </div>

          {/* Acciones */}
          <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col-reverse sm:flex-row gap-3 bg-[#121212] flex-shrink-0">
            <button
              id="btn-delivery-volver"
              type="button"
              onClick={onVolver}
              className="sm:flex-1 py-3.5 rounded-full bg-white/10 text-white/80 text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
            >
              Volver
            </button>
            <button
              id="btn-delivery-enviar"
              type="submit"
              className="sm:flex-[2] py-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <IconoWhatsApp className="w-5 h-5" />
              Enviar pedido por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
