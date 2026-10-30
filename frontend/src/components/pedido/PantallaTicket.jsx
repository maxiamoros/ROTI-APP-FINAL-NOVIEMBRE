import { createPortal } from 'react-dom';
import { descargarTicket, urlWhatsApp } from '../../utils/pedido';
import TicketPedido from './TicketPedido';
import IconoWhatsApp from './IconoWhatsApp';

/** Mensaje de ayuda debajo del título, según modalidad y método de pago. */
function mensajeSegunPedido(pedido) {
  if (pedido.modalidad === 'delivery') {
    return 'Abrimos WhatsApp con tu pedido listo para enviar. Si no se abrió, tocá "Enviar por WhatsApp".';
  }
  const accion = pedido.metodoPago === 'Efectivo'
    ? 'Acercate a la caja para abonar'
    : 'Acercate a la caja para escanear el QR';
  return pedido.modalidad === 'local'
    ? `${accion}. ¡Te avisamos cuando esté listo!`
    : `${accion} y retirar tu pedido.`;
}

/**
 * Pantalla final: confirmación + ticket del pedido + acciones (imprimir, descargar, WhatsApp, nuevo pedido).
 *
 * Props:
 *  - pedido:        objeto pedido ya confirmado (con fecha)
 *  - onNuevoPedido: () => void — limpia todo y vuelve al menú
 */
export default function PantallaTicket({ pedido, onNuevoPedido }) {
  if (!pedido) return null;
  const esDelivery = pedido.modalidad === 'delivery';

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-[#121212]/95 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-titulo"
      >
        <div className="min-h-full flex flex-col items-center px-4 py-8 md:py-12 animate-fade-in-up">
          {/* Confirmación */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#E84A5F] to-[#d4a843] rounded-full flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(232,74,95,0.45)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 md:w-12 md:h-12 text-white" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 id="ticket-titulo" className="text-3xl md:text-5xl font-black text-white mb-3 uppercase text-center">
            ¡Pedido Confirmado!
          </h2>
          <p className="text-base md:text-xl text-white/70 text-center max-w-xl mb-8">
            {mensajeSegunPedido(pedido)}
          </p>

          {/* Ticket en pantalla */}
          <TicketPedido
            pedido={pedido}
            className="select-text w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          />

          {/* Acciones */}
          <div className="w-full max-w-sm flex flex-col gap-3 mt-6">
            {esDelivery && (
              <a
                id="btn-ticket-whatsapp"
                href={urlWhatsApp(pedido)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <IconoWhatsApp className="w-5 h-5" />
                Enviar por WhatsApp
              </a>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-ticket-imprimir"
                type="button"
                onClick={() => window.print()}
                className="py-3.5 rounded-full bg-gradient-to-r from-[#E84A5F] to-[#d4a843] text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
              >
                🖨️ Imprimir
              </button>
              <button
                id="btn-ticket-descargar"
                type="button"
                onClick={() => descargarTicket(pedido)}
                className="py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                ⬇️ Descargar
              </button>
            </div>
            <button
              id="btn-ticket-nuevo"
              type="button"
              onClick={onNuevoPedido}
              className="w-full py-3.5 rounded-full border-2 border-white/20 text-white/80 text-sm font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              Hacer un nuevo pedido
            </button>
          </div>
        </div>
      </div>

      {/*
        Copia para impresión: se monta directo en <body> para que no la recorten los
        contenedores `fixed`/`overflow` del portal. Usa las reglas `.print-only` de index.css
        (oculta en pantalla, visible solo al imprimir, ancho 80mm).
      */}
      {createPortal(
        <div className="print-only hidden">
          <TicketPedido pedido={pedido} className="w-[80mm] p-4 pb-12" />
        </div>,
        document.body
      )}
    </>
  );
}
