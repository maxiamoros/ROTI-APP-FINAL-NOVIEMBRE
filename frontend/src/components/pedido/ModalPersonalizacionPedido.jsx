import { useState, useMemo, useEffect } from 'react';
import {
  obtenerConfigProducto,
  productoIncluyePapas,
  esBebida,
  obtenerOpcionesAcompanamiento,
  PRECIO_MEDALLON_EXTRA,
  TAMANOS_GASEOSAS,
  MARCAS_GASEOSAS,
  OTRAS_BEBIDAS,
} from '../../data/ingredientesProductos';
import { formatPeso } from '../../utils/pedido';

/**
 * Modal de Personalización de Pedido en 4 pasos ordenados:
 * 1) PERSONALIZAR INGREDIENTES
 *    - Opciones de selección única (salsas con descripciones cortas, tipo de carne, etc.)
 *    - Medallones de carne con contador (mínimo 2, máximo 4, costo extra editable)
 *    - Ingredientes fijos ("Incluye:") no eliminables
 *    - Ingredientes opcionales como checkboxes tildados por defecto
 * 2) ACOMPAÑAMIENTO (Papas fritas +$8.000, Papas con cheddar +$10.000, Sin acompañamiento $0)
 *    - Omitido si el plato ya incluye papas o si son papas
 * 3) BEBIDA (Opcional)
 *    - Gaseosas (Coca Cola, Sprite, Fanta) con selección de tamaño:
 *      Lata $2.800, Botella 500 ml $3.500, 1 lt $4.000, 1,25 lts $4.500, 2 lts $7.000
 *    - Otras bebidas: Cerveza Andes $5.000, Vino Malbec $8.000, Vino Blanco $10.000, Agua $3.000, Soda $5.000
 *    - Pregunta "¿Con hielo o Sin hielo?" solo para gaseosas, agua y soda
 * 4) RESUMEN Y AGREGAR AL CARRITO
 *    - Desglose con producto + medallones extra + acompañamiento + bebida
 *    - Total unitario y por cantidad
 */
export default function ModalPersonalizacionPedido({
  producto,
  productosMenu = [],
  onClose,
  onConfirm,
}) {
  // ── 1. Análisis de configuración del producto ───────────────────────────────
  const config = useMemo(() => (producto ? obtenerConfigProducto(producto) : null), [producto]);
  const esProdBebida = useMemo(() => (producto ? esBebida(producto) : false), [producto]);
  const yaTienePapas = useMemo(() => (producto ? productoIncluyePapas(producto) : false), [producto]);
  const tieneMedallones = Boolean(config?.tieneMedallones);

  // Lista de pasos aplicables a este producto
  const pasosDisponibles = useMemo(() => {
    const list = [];
    if (!esProdBebida) {
      list.push({ id: 1, numero: 1, titulo: 'Ingredientes', icono: '🥗' });
      if (!yaTienePapas) {
        list.push({ id: 2, numero: 2, titulo: 'Acompañamiento', icono: '🍟' });
      }
      list.push({ id: 3, numero: list.length + 1, titulo: 'Bebida', icono: '🥤' });
    } else {
      list.push({ id: 3, numero: 1, titulo: 'Bebida', icono: '🥤' });
    }
    list.push({ id: 4, numero: list.length + 1, titulo: 'Resumen', icono: '📝' });
    return list;
  }, [esProdBebida, yaTienePapas]);

  // Paso activo actual
  const [pasoActivo, setPasoActivo] = useState(() => pasosDisponibles[0]?.id || 1);

  // ── 2. Estado Paso 1: Opciones de selección única (radio) ────────────────────
  const [opcionesRadio, setOpcionesRadio] = useState(() => {
    const init = {};
    if (config?.opciones) {
      config.opciones.forEach((op) => {
        const defaultVal = op.default || (typeof op.valores[0] === 'object' ? op.valores[0].nombre : op.valores[0]);
        init[op.id] = defaultVal;
      });
    }
    return init;
  });

  // Contador de medallones (Hamburguesa doble cheddar: 2 a 4)
  const [medallones, setMedallones] = useState(2);

  // Ingredientes fijos y opcionales según variedad o producto directo
  const { ingredientesFijos, ingredientesOpcionales } = useMemo(() => {
    if (!config) return { ingredientesFijos: [], ingredientesOpcionales: [] };
    if (config.variedades) {
      const varElegida = opcionesRadio.variedad || Object.keys(config.variedades)[0];
      const dataVar = config.variedades[varElegida] || { fijos: [], opcionales: [] };
      return {
        ingredientesFijos: dataVar.fijos || [],
        ingredientesOpcionales: dataVar.opcionales || [],
      };
    }
    return {
      ingredientesFijos: config.fijos || [],
      ingredientesOpcionales: config.opcionales || [],
    };
  }, [config, opcionesRadio.variedad]);

  // Checkboxes de ingredientes opcionales: TODOS TILDADOS por defecto
  const [ingredientesTildados, setIngredientesTildados] = useState(() => {
    if (!config) return [];
    if (config.variedades) {
      const varElegida = config.opciones?.find((o) => o.id === 'variedad')?.default || 'Carne tradicional';
      return config.variedades[varElegida]?.opcionales || [];
    }
    return config.opcionales || [];
  });

  // Al cambiar la variedad (ej. empanadas de carne a pollo), reiniciamos los opcionales tildados
  useEffect(() => {
    if (config?.variedades) {
      const varElegida = opcionesRadio.variedad;
      if (varElegida && config.variedades[varElegida]) {
        setIngredientesTildados([...(config.variedades[varElegida].opcionales || [])]);
      }
    }
  }, [opcionesRadio.variedad, config]);

  // Si cambia el producto recibido, reiniciamos el estado completo
  useEffect(() => {
    if (producto) {
      setPasoActivo(pasosDisponibles[0]?.id || 1);
      const initRadio = {};
      if (config?.opciones) {
        config.opciones.forEach((op) => {
          const defaultVal = op.default || (typeof op.valores[0] === 'object' ? op.valores[0].nombre : op.valores[0]);
          initRadio[op.id] = defaultVal;
        });
      }
      setOpcionesRadio(initRadio);
      setMedallones(2);
      setCantidad(1);
      setAclaracion('');
      setAcompElegidoId('sin_acomp');
      setTipoBebida('sin_bebida');
      setMarcaGaseosa('Coca Cola');
      setTamanoGaseosaId('1_25lts');
      setConHielo(true);
    }
  }, [producto?.id]);

  // Destildados: los ingredientes que el cliente desmarcó
  const destildados = useMemo(() => {
    return ingredientesOpcionales.filter((ing) => !ingredientesTildados.includes(ing));
  }, [ingredientesOpcionales, ingredientesTildados]);

  const sinTexto = useMemo(() => {
    return destildados.length > 0 ? `Sin: ${destildados.join(', ')}` : '';
  }, [destildados]);

  const toggleIngrediente = (ing) => {
    setIngredientesTildados((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  // ── 3. Estado Paso 2: Acompañamiento ────────────────────────────────────────
  const opcionesAcompanamiento = useMemo(
    () => obtenerOpcionesAcompanamiento(productosMenu),
    [productosMenu]
  );
  const [acompElegidoId, setAcompElegidoId] = useState('sin_acomp');

  const acompanamientoSeleccionado = useMemo(() => {
    return opcionesAcompanamiento.find((a) => a.id === acompElegidoId) || opcionesAcompanamiento[0];
  }, [opcionesAcompanamiento, acompElegidoId]);

  // ── 4. Estado Paso 3: Bebida Oficial ────────────────────────────────────────
  // 'sin_bebida' | 'gaseosa' | 'cerveza_andes' | 'vino_malbec' | 'vino_blanco' | 'agua' | 'soda'
  const [tipoBebida, setTipoBebida] = useState('sin_bebida');
  const [marcaGaseosa, setMarcaGaseosa] = useState('Coca Cola');
  const [tamanoGaseosaId, setTamanoGaseosaId] = useState('1_25lts');
  const [conHielo, setConHielo] = useState(true);

  // Calcula configuración de la bebida seleccionada
  const infoBebida = useMemo(() => {
    if (tipoBebida === 'sin_bebida') {
      return {
        id: 'sin_bebida',
        nombre: 'Sin bebida',
        tamano: '',
        precio: 0,
        requiereHielo: false,
        resumenTexto: 'Sin bebida',
      };
    }

    if (tipoBebida === 'gaseosa') {
      const tamObj = TAMANOS_GASEOSAS.find((t) => t.id === tamanoGaseosaId) || TAMANOS_GASEOSAS[3];
      const hieloTxt = conHielo ? 'Con hielo' : 'Sin hielo';
      return {
        id: 'gaseosa',
        nombre: marcaGaseosa,
        tamano: tamObj.label,
        hielo: hieloTxt,
        precio: tamObj.precio,
        requiereHielo: true,
        resumenTexto: `${marcaGaseosa} ${tamObj.label} (${hieloTxt})`,
      };
    }

    const otra = OTRAS_BEBIDAS.find((b) => b.id === tipoBebida);
    if (otra) {
      const hieloTxt = otra.requiereHielo ? (conHielo ? 'Con hielo' : 'Sin hielo') : '';
      return {
        id: otra.id,
        nombre: otra.nombre,
        tamano: '',
        hielo: hieloTxt,
        precio: otra.precio,
        requiereHielo: otra.requiereHielo,
        resumenTexto: hieloTxt ? `${otra.nombre} (${hieloTxt})` : otra.nombre,
      };
    }

    return { id: 'sin_bebida', nombre: 'Sin bebida', tamano: '', precio: 0, requiereHielo: false, resumenTexto: 'Sin bebida' };
  }, [tipoBebida, marcaGaseosa, tamanoGaseosaId, conHielo]);

  // ── 5. Estado Paso 4: Cantidad y notas ──────────────────────────────────────
  const [cantidad, setCantidad] = useState(1);
  const [aclaracion, setAclaracion] = useState('');

  // ── 6. Cálculo de Precios ────────────────────────────────────────────────────
  const precioBase = Number(producto?.precio) || 0;
  const medallonesExtra = tieneMedallones ? Math.max(0, medallones - 2) : 0;
  const costoMedallonesExtra = medallonesExtra * PRECIO_MEDALLON_EXTRA;
  const precioAcomp = !yaTienePapas && acompanamientoSeleccionado ? acompanamientoSeleccionado.precio : 0;
  const precioBebida = infoBebida ? infoBebida.precio : 0;

  // Regla: total = producto + medallones extra + acompañamiento + bebida
  const precioUnitarioTotal = precioBase + costoMedallonesExtra + precioAcomp + precioBebida;
  const precioTotalFinal = precioUnitarioTotal * cantidad;

  // Texto representativo de medallones
  const medallonesTexto = tieneMedallones
    ? medallones > 2
      ? `Medallones: ${medallones} (+${medallonesExtra} extra)`
      : 'Medallones: 2'
    : '';

  // ── 7. Navegación entre pasos ───────────────────────────────────────────────
  const pasoIndice = pasosDisponibles.findIndex((p) => p.id === pasoActivo);
  const esPrimerPaso = pasoIndice === 0;
  const esUltimoPaso = pasoIndice === pasosDisponibles.length - 1;

  const irSiguiente = () => {
    if (!esUltimoPaso) {
      setPasoActivo(pasosDisponibles[pasoIndice + 1].id);
    }
  };

  const irAnterior = () => {
    if (!esPrimerPaso) {
      setPasoActivo(pasosDisponibles[pasoIndice - 1].id);
    }
  };

  // ── 8. Confirmación final: armado del ítem para el carrito ───────────────────
  const handleConfirmar = () => {
    const opcionesLabels = Object.entries(opcionesRadio).map(([_, val]) => val);
    const opcionTexto = opcionesLabels.join(', ');

    const acompObj =
      !yaTienePapas && acompanamientoSeleccionado && acompanamientoSeleccionado.id !== 'sin_acomp'
        ? {
            id: acompanamientoSeleccionado.id,
            nombre: acompanamientoSeleccionado.nombre,
            precio: acompanamientoSeleccionado.precio,
          }
        : null;

    const bebidaObj =
      infoBebida && infoBebida.id !== 'sin_bebida'
        ? {
            id: infoBebida.id,
            nombre: infoBebida.nombre,
            tamano: infoBebida.tamano,
            hielo: infoBebida.hielo,
            precio: infoBebida.precio,
          }
        : null;

    const itemPersonalizado = {
      ...producto,
      id: producto.id,
      nombre: producto.nombre,
      precio: precioUnitarioTotal,
      precioBase,
      medallones: tieneMedallones ? medallones : null,
      medallonesTexto,
      costoMedallonesExtra,
      cantidad,
      opcion: opcionTexto,
      sinIngredientes: destildados,
      sinTexto,
      acompanamiento: acompObj,
      bebida: bebidaObj,
      aclaracion: aclaracion.trim(),
    };

    onConfirm(itemPersonalizado);
  };

  if (!producto) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-personalizacion-titulo"
    >
      <div className="bg-[#181818] text-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/15 max-h-[94vh]">
        
        {/* ENCABEZADO FIJO: Foto, Nombre, Precio base y Cerrar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#121212] flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 shadow-md">
              {producto.imagenUrl ? (
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/roti_logo.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                  Sin Foto
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-widest text-[#d4a843] uppercase block">
                Personalizá tu pedido
              </span>
              <h2
                id="modal-personalizacion-titulo"
                className="text-lg sm:text-xl font-black text-white uppercase tracking-wide truncate"
              >
                {producto.nombre}
              </h2>
              <p className="text-xl sm:text-2xl font-black text-[#FECEA8] mt-0.5">
                {formatPeso(precioUnitarioTotal)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 flex-shrink-0 ml-2"
            aria-label="Cerrar personalización"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* INDICADOR DE PASOS (STEPPER) */}
        <div className="bg-[#141414] px-4 sm:px-6 py-2.5 border-b border-white/10 flex items-center justify-between gap-1 overflow-x-auto hide-scrollbar flex-shrink-0">
          {pasosDisponibles.map((paso, idx) => {
            const esActivo = paso.id === pasoActivo;
            const esPasado = idx < pasoIndice;
            return (
              <button
                key={paso.id}
                type="button"
                onClick={() => setPasoActivo(paso.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  esActivo
                    ? 'bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white shadow-md'
                    : esPasado
                    ? 'bg-white/10 text-white/90 hover:bg-white/15'
                    : 'bg-white/5 text-white/40 hover:text-white/70'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    esActivo
                      ? 'bg-white text-black'
                      : esPasado
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {esPasado ? '✓' : paso.numero}
                </span>
                <span>{paso.titulo}</span>
              </button>
            );
          })}
        </div>

        {/* CUERPO CON SCROLL DEL PASO ACTIVO */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6 bg-[#181818]">

          {/* ═══════════════════════════════════════════════════════════════════
              PASO 1: PERSONALIZAR INGREDIENTES
             ═══════════════════════════════════════════════════════════════════ */}
          {pasoActivo === 1 && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Opciones de selección única (radio): Salsas, Carne o Variedad */}
              {config?.opciones && config.opciones.length > 0 && (
                <div className="space-y-4">
                  {config.opciones.map((op) => (
                    <div key={op.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#d4a843] uppercase tracking-wider flex items-center gap-2">
                          <span>✨</span> {op.titulo}
                        </span>
                        <span className="text-[11px] text-white/50">Selección única</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {op.valores.map((val) => {
                          const valNombre = typeof val === 'object' ? val.nombre : val;
                          const valDesc = typeof val === 'object' ? val.descripcion : '';
                          const estaSeleccionado = opcionesRadio[op.id] === valNombre;

                          return (
                            <button
                              key={valNombre}
                              type="button"
                              onClick={() =>
                                setOpcionesRadio((prev) => ({ ...prev, [op.id]: valNombre }))
                              }
                              className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                                estaSeleccionado
                                  ? 'border-[#d4a843] bg-[#d4a843]/15 text-white shadow-md'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <span className="text-xs font-bold text-white block">
                                  {valNombre}
                                </span>
                                {valDesc && (
                                  <p className="text-[11px] text-white/50 mt-1 leading-snug">
                                    {valDesc}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  estaSeleccionado
                                    ? 'border-[#d4a843] bg-[#d4a843]'
                                    : 'border-white/40'
                                }`}
                              >
                                {estaSeleccionado && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contador de medallones (Hamburguesa doble cheddar: 2 a 4) */}
              {tieneMedallones && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#d4a843] uppercase tracking-wider block">
                      🥩 Medallones de carne
                    </span>
                    <p className="text-xs text-white/70 mt-0.5">
                      Incluye 2 medallones de carne vacuna. Podés sumar hasta 4 medallones.
                    </p>
                    {medallonesExtra > 0 ? (
                      <span className="text-xs font-bold text-[#FECEA8] block mt-1">
                        +{formatPeso(costoMedallonesExtra)} (+{formatPeso(PRECIO_MEDALLON_EXTRA)} c/u extra)
                      </span>
                    ) : (
                      <span className="text-[11px] text-white/40 block mt-1">
                        Cantidad estándar incluida en el precio base.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-black/50 p-1.5 rounded-full border border-white/15 self-start sm:self-auto">
                    <button
                      type="button"
                      disabled={medallones <= 2}
                      onClick={() => setMedallones((m) => Math.max(2, m - 1))}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center font-black text-white text-base transition-all cursor-pointer"
                      aria-label="Restar medallón"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-black text-white text-lg">
                      {medallones}
                    </span>
                    <button
                      type="button"
                      disabled={medallones >= 4}
                      onClick={() => setMedallones((m) => Math.min(4, m + 1))}
                      className="w-9 h-9 rounded-full bg-[#E84A5F] hover:bg-red-600 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center font-black text-white text-base transition-all cursor-pointer shadow-md"
                      aria-label="Sumar medallón"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Sección fija: INCLUYE (ingredientes no eliminables) */}
              {ingredientesFijos.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block mb-2.5">
                    📌 Incluye (receta tradicional fija):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ingredientesFijos.map((fijo) => (
                      <span
                        key={fijo}
                        className="px-3 py-1.5 rounded-xl bg-white/10 text-white/90 text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                      >
                        <span className="text-emerald-400 font-bold">✓</span>
                        {fijo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección opcional: Checkboxes tildados por defecto */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Ingredientes opcionales
                    </h3>
                    <p className="text-xs text-white/50">
                      Vienen tildados. Destildá si querés sacar alguno:
                    </p>
                  </div>
                  {destildados.length > 0 && (
                    <span className="text-xs font-bold text-[#E84A5F] bg-[#E84A5F]/15 border border-[#E84A5F]/30 px-2.5 py-1 rounded-full">
                      {destildados.length} quitado(s)
                    </span>
                  )}
                </div>

                {ingredientesOpcionales.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ingredientesOpcionales.map((ing) => {
                      const tildado = ingredientesTildados.includes(ing);
                      return (
                        <div
                          key={ing}
                          onClick={() => toggleIngrediente(ing)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                            tildado
                              ? 'bg-white/5 border-white/15 hover:border-white/30 text-white'
                              : 'bg-red-500/10 border-red-500/30 text-white/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                tildado
                                  ? 'bg-gradient-to-br from-[#E84A5F] to-[#d4a843] text-white shadow-sm'
                                  : 'border-2 border-white/30 bg-transparent'
                              }`}
                            >
                              {tildado && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-xs font-semibold truncate ${
                                tildado ? 'text-white' : 'line-through text-white/40'
                              }`}
                            >
                              {ing}
                            </span>
                          </div>

                          {!tildado && (
                            <span className="text-[10px] font-black text-[#E84A5F] bg-[#E84A5F]/20 px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider">
                              Sin
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs leading-relaxed">
                    Este plato se elabora con su receta tradicional fija (no contiene ingredientes opcionales para destildar).
                  </div>
                )}

                {/* Banner de destildados */}
                {destildados.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-[#ff9aa6]">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <span className="font-bold block">Se preparará:</span>
                      <span>{sinTexto}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PASO 2: ACOMPAÑAMIENTO (Papas fritas +$8.000 / Papas con cheddar +$10.000)
             ═══════════════════════════════════════════════════════════════════ */}
          {pasoActivo === 2 && !yaTienePapas && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  ¿Deseás sumar un acompañamiento?
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Podés acompañar tu plato con una porción de papas o continuar sin acompañamiento.
                </p>
              </div>

              <div className="space-y-3">
                {opcionesAcompanamiento.map((acomp) => {
                  const estaSeleccionado = acompElegidoId === acomp.id;
                  return (
                    <div
                      key={acomp.id}
                      onClick={() => setAcompElegidoId(acomp.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        estaSeleccionado
                          ? 'border-[#d4a843] bg-[#d4a843]/15 shadow-lg shadow-black/40'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            estaSeleccionado
                              ? 'border-[#d4a843] bg-[#d4a843]'
                              : 'border-white/40'
                          }`}
                        >
                          {estaSeleccionado && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {acomp.nombre}
                            </span>
                            {acomp.id === 'sin_acomp' && (
                              <span className="text-[10px] text-white/40 border border-white/20 px-2 py-0.5 rounded-full uppercase">
                                Por defecto
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">
                            {acomp.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {acomp.precio > 0 ? (
                          <span className="text-sm font-black text-[#FECEA8]">
                            +{formatPeso(acomp.precio)}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-white/40">
                            $0
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PASO 3: BEBIDAS OFICIALES (Gaseosas con tamaños, Otras bebidas, Con/Sin Hielo)
             ═══════════════════════════════════════════════════════════════════ */}
          {pasoActivo === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  ¿Querés sumar una bebida fría?
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Elegí una gaseosa con el tamaño deseado, otra bebida o marcá "Sin bebida".
                </p>
              </div>

              {/* Botón rápido: Sin bebida */}
              <div
                onClick={() => setTipoBebida('sin_bebida')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  tipoBebida === 'sin_bebida'
                    ? 'border-[#d4a843] bg-[#d4a843]/15 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      tipoBebida === 'sin_bebida' ? 'border-[#d4a843] bg-[#d4a843]' : 'border-white/40'
                    }`}
                  >
                    {tipoBebida === 'sin_bebida' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold">🚫 Sin bebida</span>
                    <span className="text-[11px] text-white/40 block">Continuar el pedido sin agregar bebidas</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white/40">$0</span>
              </div>

              {/* SECCIÓN 1: Gaseosas con selección de tamaño */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#d4a843] uppercase tracking-wider block">
                      🥤 Gaseosas (con selección de tamaño)
                    </span>
                    <span className="text-[11px] text-white/50">Coca Cola, Sprite o Fanta</span>
                  </div>
                  {tipoBebida === 'gaseosa' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                      Seleccionada
                    </span>
                  )}
                </div>

                {/* Selección de Marca de Gaseosa */}
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest block mb-2">
                    Marca / Sabor:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MARCAS_GASEOSAS.map((marca) => {
                      const activo = tipoBebida === 'gaseosa' && marcaGaseosa === marca;
                      return (
                        <button
                          key={marca}
                          type="button"
                          onClick={() => {
                            setTipoBebida('gaseosa');
                            setMarcaGaseosa(marca);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                            activo
                              ? 'bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                          }`}
                        >
                          {marca}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selección de Tamaño de Gaseosa */}
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest block mb-2">
                    Tamaño de gaseosa:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TAMANOS_GASEOSAS.map((tam) => {
                      const activo = tipoBebida === 'gaseosa' && tamanoGaseosaId === tam.id;
                      return (
                        <button
                          key={tam.id}
                          type="button"
                          onClick={() => {
                            setTipoBebida('gaseosa');
                            setTamanoGaseosaId(tam.id);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            activo
                              ? 'border-[#d4a843] bg-[#d4a843]/20 text-white shadow-sm'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold block">{tam.label}</span>
                          <span className="text-xs font-black text-[#FECEA8] mt-0.5 block">
                            +{formatPeso(tam.precio)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: Otras bebidas (sin selección de tamaño) */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-[#d4a843] uppercase tracking-wider block">
                  🍺 Otras bebidas (precio fijo)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OTRAS_BEBIDAS.map((beb) => {
                    const estaSeleccionada = tipoBebida === beb.id;
                    return (
                      <button
                        key={beb.id}
                        type="button"
                        onClick={() => setTipoBebida(beb.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          estaSeleccionada
                            ? 'border-[#d4a843] bg-[#d4a843]/20 text-white shadow-md'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-bold text-white block">
                            {beb.nombre}
                          </span>
                          <span className="text-[10px] text-white/40 block">
                            {beb.requiereHielo ? 'Opción con/sin hielo' : 'Servido frío'}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#FECEA8] flex-shrink-0">
                          +{formatPeso(beb.precio)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECCIÓN 3: Pregunta Con Hielo / Sin Hielo (solo para gaseosas, agua y soda) */}
              {infoBebida.requiereHielo && (
                <div className="bg-sky-500/10 border border-sky-500/25 p-4 rounded-2xl animate-fade-in space-y-2.5">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                    🧊 ¿Cómo preferís tu bebida?
                  </span>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setConHielo(true)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        conHielo
                          ? 'border-sky-400 bg-sky-500/30 text-white shadow-md'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <span>🧊</span> Con hielo
                    </button>
                    <button
                      type="button"
                      onClick={() => setConHielo(false)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        !conHielo
                          ? 'border-amber-400 bg-amber-500/30 text-white shadow-md'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <span>🥤</span> Sin hielo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PASO 4: RESUMEN Y AGREGAR AL CARRITO
             ═══════════════════════════════════════════════════════════════════ */}
          {pasoActivo === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Resumen de tu elección
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Revisá el detalle antes de sumar el plato a tu pedido.
                </p>
              </div>

              {/* Tarjeta de Resumen Detallado */}
              <div className="bg-[#141414] border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4">
                
                {/* Producto y opción */}
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <h4 className="font-black text-base text-white uppercase tracking-wide">
                      {producto.nombre}
                    </h4>
                    {Object.values(opcionesRadio).length > 0 && (
                      <p className="text-xs text-[#d4a843] font-bold mt-0.5">
                        {Object.values(opcionesRadio).join(' • ')}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-black text-[#FECEA8]">
                    {formatPeso(precioBase)}
                  </span>
                </div>

                {/* Medallones (Hamburguesa) */}
                {tieneMedallones && (
                  <div className="text-xs space-y-1">
                    <span className="text-white/50 uppercase tracking-widest text-[10px] font-bold block">
                      Medallones de carne
                    </span>
                    <div className="flex justify-between items-center text-white">
                      <span className="font-semibold text-[#FECEA8]">
                        🥩 {medallonesTexto}
                      </span>
                      {costoMedallonesExtra > 0 && (
                        <span className="text-xs font-bold text-[#FECEA8]">
                          +{formatPeso(costoMedallonesExtra)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Ingredientes fijos incluidos */}
                {ingredientesFijos.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="text-white/50 uppercase tracking-widest text-[10px] font-bold block">
                      Incluye siempre
                    </span>
                    <p className="text-white/80 font-medium text-xs">
                      {ingredientesFijos.join(', ')}
                    </p>
                  </div>
                )}

                {/* Ingredientes opcionales modificados */}
                {ingredientesOpcionales.length > 0 && (
                  <div className="text-xs space-y-1.5 border-t border-white/10 pt-3">
                    <span className="text-white/50 uppercase tracking-widest text-[10px] font-bold block">
                      Ingredientes opcionales
                    </span>
                    {destildados.length > 0 ? (
                      <div className="flex items-center gap-2 text-[#E84A5F] font-bold">
                        <span>❌</span>
                        <span>{sinTexto}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <span>✓</span>
                        <span>Con todos sus ingredientes opcionales</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Acompañamiento */}
                {!yaTienePapas && (
                  <div className="text-xs space-y-1 border-t border-white/10 pt-3">
                    <span className="text-white/50 uppercase tracking-widest text-[10px] font-bold block">
                      Acompañamiento
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">
                        {acompanamientoSeleccionado.nombre}
                      </span>
                      <span className="text-xs font-bold text-[#FECEA8]">
                        {acompanamientoSeleccionado.precio > 0
                          ? `+${formatPeso(acompanamientoSeleccionado.precio)}`
                          : 'Sin cargo'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bebida */}
                <div className="text-xs space-y-1 border-t border-white/10 pt-3">
                  <span className="text-white/50 uppercase tracking-widest text-[10px] font-bold block">
                    Bebida
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">
                      {infoBebida.resumenTexto}
                    </span>
                    <span className="text-xs font-bold text-[#FECEA8]">
                      {infoBebida.precio > 0
                        ? `+${formatPeso(infoBebida.precio)}`
                        : 'Sin cargo'}
                    </span>
                  </div>
                </div>

                {/* Desglose total unitario */}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-white/60 uppercase">
                    Precio unitario final
                  </span>
                  <span className="text-base font-black text-[#FECEA8]">
                    {formatPeso(precioUnitarioTotal)}
                  </span>
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Cantidad
                  </span>
                  <span className="text-[11px] text-white/50">¿Cuántos platos iguales querés?</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-lg font-bold text-white transition-all cursor-pointer border border-white/10"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white w-8 text-center">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => c + 1)}
                    className="w-10 h-10 rounded-full bg-[#E84A5F] hover:bg-red-600 active:scale-95 flex items-center justify-center text-lg font-bold text-white transition-all cursor-pointer shadow-md"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Aclaración opcional */}
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-2">
                  Aclaración adicional para la cocina (opcional)
                </label>
                <input
                  type="text"
                  value={aclaracion}
                  onChange={(e) => setAclaracion(e.target.value)}
                  placeholder="Ej: bien cocido, servilletas extra..."
                  maxLength={120}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#d4a843] rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* PIE DE PÁGINA FIJO CON ACCIONES */}
        <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-between gap-3 bg-[#121212] flex-shrink-0">
          {esPrimerPaso ? (
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-full bg-white/10 text-white/80 text-xs sm:text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={irAnterior}
              className="py-3 px-5 rounded-full bg-white/10 text-white/80 text-xs sm:text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ← Volver
            </button>
          )}

          {!esUltimoPaso ? (
            <button
              type="button"
              onClick={irSiguiente}
              className="py-3 px-7 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] hover:from-[#ff5469] hover:to-[#e5b74b] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmar}
              className="flex-1 max-w-sm py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] hover:from-[#ff5469] hover:to-[#e5b74b] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <span>Agregar al pedido</span>
              <span className="bg-black/30 px-3 py-1 rounded-full text-white text-xs">
                {formatPeso(precioTotalFinal)}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
