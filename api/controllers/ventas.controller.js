const prisma = require('../prisma');

const ESTADOS_COCINA = new Set(['nuevo', 'preparando', 'listo', 'entregado']);

const getVentas = async (req, res) => {
  try {
    const { cocina } = req.query;
    const where = cocina === '1'
      ? { estado: { in: ['nuevo', 'preparando', 'listo'] } }
      : undefined;

    const pedidos = await prisma.pedido.findMany({
      where,
      orderBy: { fecha: 'desc' }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

const createVenta = async (req, res) => {
  try {
    const { items, total, metodo, estado } = req.body || {};
    // Validate request body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    if (typeof total === 'undefined' || isNaN(parseFloat(total))) {
      return res.status(400).json({ error: 'Total must be a number' });
    }
    if (!metodo) {
      return res.status(400).json({ error: 'Metodo is required' });
    }
    // items debe ser un array: [{ id: productoId, cantidad, nombre, precio }]

    if (parseFloat(total) < 0) {
      return res.status(400).json({ error: 'Total must be positive' });
    }

    // 'nuevo' = entra a cocina KDS; se aceptan también estados de cocina explícitos
    const estadoInicial = ESTADOS_COCINA.has(estado) ? estado : 'nuevo';

    // Pedido y descuento de stock en la misma transacción: o se registra todo o nada
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          total: parseFloat(total),
          estado: estadoInicial,
          items: JSON.stringify(items) // Guardamos el detalle en JSON string
        }
      });

      // Por cada item vendido, buscamos su receta
      for (const item of items) {
        const productoId = Number(item?.id);
        const cantidad = Number(item?.cantidad) || 1;
        // Ítems del catálogo local de respaldo pueden no tener un id válido de la base
        if (!Number.isInteger(productoId) || productoId > 2147483647) continue;

        const producto = await tx.producto.findUnique({
          where: { id: productoId },
          include: { receta: true }
        });

        for (const recetaItem of producto?.receta || []) {
          await tx.insumo.update({
            where: { id: recetaItem.insumoId },
            data: {
              stock: { decrement: Math.round(recetaItem.cantidad * cantidad) } // Suponiendo stock entero
            }
          });
        }
      }

      return nuevoPedido;
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error("Error al crear venta", error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
};

const updateEstadoVenta = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    if (!ESTADOS_COCINA.has(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Use: nuevo, preparando, listo o entregado'
      });
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado }
    });
    res.json(pedido);
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    console.error('Error al actualizar estado', error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
};

module.exports = {
  getVentas,
  createVenta,
  updateEstadoVenta
};
