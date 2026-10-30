import { MODALIDADES, formatPeso } from '../../utils/pedido';

/**
 * Pantalla de elección de modalidad (primer paso al finalizar el pedido).
 * Muestra 3 botones grandes: Comer en el local / Para llevar / Delivery.
 *
 * Props:
 *  - total:    total del carrito (para mostrarlo como referencia)
 *  - onElegir: (idModalidad) => void
 *  - onVolver: () => void  — vuelve al carrito
 */
export default function ModalModalidad({ total, onElegir, onVolver }) {
  const opciones = Object.values(MODALIDADES);

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalidad-titulo"
    >
      <div className="min-h-full flex flex-col items-center justify-center p-5 sm:p-8">
        <span className="text-xs font-bold text-[#d4a843] bg-[#d4a843]/10 border border-[#d4a843]/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
          Total {formatPeso(total)}
        </span>
        <h2
          id="modalidad-titulo"
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 md:mb-12 text-center uppercase"
        >
          ¿Cómo querés tu pedido?
        </h2>

        {/* En celular: botones apilados (ícono a la izquierda). En tablet/PC: 3 columnas. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-5xl w-full">
          {opciones.map((op) => (
            <button
              key={op.id}
              id={`btn-modalidad-${op.id}`}
              type="button"
              onClick={() => onElegir(op.id)}
              className="group bg-[#2A363B] border-4 border-white/10 hover:border-[#d4a843]/60 active:border-[#E84A5F] rounded-3xl p-5 sm:p-8 md:p-10 flex sm:flex-col items-center gap-4 sm:gap-6 text-left sm:text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 bg-[#E84A5F]/15 border border-[#E84A5F]/30 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-3xl sm:text-5xl" aria-hidden="true">{op.emoji}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-[#d4a843] transition-colors">
                  {op.label}
                </span>
                <span className="text-sm sm:text-base md:text-lg text-white/50">{op.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          id="btn-modalidad-volver"
          type="button"
          onClick={onVolver}
          className="mt-8 md:mt-12 px-8 md:px-12 py-4 md:py-5 rounded-2xl border-2 border-white/20 text-white text-lg md:text-2xl font-bold hover:bg-white/10 active:bg-white/10 transition-colors cursor-pointer"
        >
          Volver al pedido
        </button>
      </div>
    </div>
  );
}
