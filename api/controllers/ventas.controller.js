const prisma = require('../prisma');

const getVentas = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
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

    // 1. Guardar el pedido (venta)
    const pedido = await prisma.pedido.create({
      data: {
        total: parseFloat(total),
        estado: estado || 'completado',
        items: JSON.stringify(items) // Guardamos el detalle en JSON string
      }
    });

    // 2. Descontar stock de insumos usando transacciones
    // Por cada item vendido, buscamos su receta
    const updates = [];

    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: parseInt(item.id) },
        include: { receta: true }
      });

      if (producto && producto.receta) {
        for (const recetaItem of producto.receta) {
          const cantidadADescontar = recetaItem.cantidad * item.cantidad;

          updates.push(
            prisma.insumo.update({
              where: { id: recetaItem.insumoId },
              data: {
                stock: { decrement: Math.round(cantidadADescontar) } // Suponiendo stock entero
              }
            })
          );
        }
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    res.status(201).json(pedido);
  } catch (error) {
    console.error("Error al crear venta", error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
};

module.exports = {
  getVentas,
  createVenta
};
