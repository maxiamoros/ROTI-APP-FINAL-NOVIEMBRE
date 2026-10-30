import { MODALIDADES, NOMBRE_LOCAL, formatFechaHora, formatPeso } from '../../utils/pedido';

/**
 * Ticket del pedido (estilo papel térmico).
 * Se usa tanto en pantalla como en la versión de impresión, a partir del mismo objeto `pedido`.
 *
 * Props:
 *  - pedido:    objeto pedido (ver utils/pedido.js)
 *  - className: clases extra para el contenedor (padding, sombra, ancho, etc.)
 */
export default function TicketPedido({ pedido, className = '' }) {
  if (!pedido) return null;

  const { fecha, hora } = formatFechaHora(pedido.fecha);
  const modalidad = MODALIDADES[pedido.modalidad];
  const cliente = pedido.cliente;

  return (
    <div className={`font-mono text-black bg-white ${className}`}>
      {/* Encabezado */}
      <div className="text-center mb-4">
        <p className="text-2xl sm:text-3xl font-black mb-1">{NOMBRE_LOCAL}</p>
        <p className="text-sm">Fecha: {fecha}</p>
        <p className="text-sm">Hora: {hora}</p>
      </div>

      {/* Número, modalidad y pago */}
      <div className="text-center mb-4 border-y-2 border-black border-dashed py-3">
        <p className="text-sm font-bold">PEDIDO</p>
        <p className="text-5xl sm:text-6xl font-black mt-1">#{pedido.numero}</p>
        <p className="text-base font-black mt-2 uppercase">{modalidad?.emoji} {modalidad?.label}</p>
        {pedido.metodoPago && <p className="text-sm font-bold mt-1 uppercase">Pago: {pedido.metodoPago}</p>}
      </div>

      {/* Detalle de productos */}
      <div className="mb-4 divide-y divide-gray-200 divide-dashed">
        {pedido.items.map((i, idx) => {
          const acompNombre = i.acompanamiento
            ? typeof i.acompanamiento === 'string'
              ? i.acompanamiento
              : i.acompanamiento.nombre
            : '';

          let bebidaDetalle = '';
          if (i.bebida) {
            if (typeof i.bebida === 'string') {
              bebidaDetalle = i.bebida;
            } else {
              const partes = [i.bebida.nombre];
              if (i.bebida.tamano) partes.push(i.bebida.tamano);
              if (i.bebida.hielo) partes.push(`(${i.bebida.hielo})`);
              bebidaDetalle = partes.join(' ');
            }
          }

          return (
            <div key={idx} className="py-2 text-sm font-bold first:pt-0 last:pb-0">
              <div className="flex justify-between gap-2">
                <span className="w-8 flex-shrink-0">{i.cantidad}x</span>
                <span className="flex-1 break-words">{i.nombre}</span>
                <span className="text-right whitespace-nowrap">{formatPeso(i.subtotal)}</span>
              </div>
              {i.cantidad > 1 && (
                <div className="pl-8 text-xs font-normal text-gray-600">{formatPeso(i.precio)} c/u</div>
              )}
              {i.medallonesTexto && (
                <div className="pl-8 text-xs font-normal text-gray-800">• {i.medallonesTexto}</div>
              )}
              {i.opcion && (
                <div className="pl-8 text-xs font-normal text-gray-800">• Opción: {i.opcion}</div>
              )}
              {i.sinTexto && (
                <div className="pl-8 text-xs font-bold text-gray-900">• {i.sinTexto}</div>
              )}
              {acompNombre && (
                <div className="pl-8 text-xs font-normal text-gray-800">• Acompañamiento: {acompNombre}</div>
              )}
              {bebidaDetalle && (
                <div className="pl-8 text-xs font-normal text-gray-800">• Bebida: {bebidaDetalle}</div>
              )}
              {i.aclaracion && !i.sinTexto && !acompNombre && !bebidaDetalle && (
                <div className="pl-8 text-xs font-normal text-gray-700 italic">• {i.aclaracion}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="border-t-2 border-black border-dashed pt-3 pb-4 flex justify-between font-black text-xl">
        <span>TOTAL:</span>
        <span>{formatPeso(pedido.total)}</span>
      </div>

      {/* Datos de entrega (solo delivery) */}
      {cliente && (
        <div className="border-t-2 border-black border-dashed pt-3 pb-2 text-sm">
          <p className="font-black mb-1">DATOS DE ENTREGA</p>
          <p><span className="font-bold">Nombre:</span> {cliente.nombre}</p>
          <p><span className="font-bold">Dirección:</span> {cliente.calle} {cliente.numero}</p>
          <p><span className="font-bold">Teléfono:</span> {cliente.telefono}</p>
          {cliente.mapaUrl && (
            <p className="mt-1">
              <span className="font-bold">Ubicación GPS:</span>{' '}
              <a
                href={cliente.mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-blue-700"
              >
                Abrir en Google Maps 📍
              </a>
            </p>
          )}
        </div>
      )}

      {/* Pie */}
      <div className="text-center mt-4 text-sm font-bold">
        ¡GRACIAS POR TU COMPRA!
        <br />
        {modalidad?.notaTicket}
      </div>
    </div>
  );
}
