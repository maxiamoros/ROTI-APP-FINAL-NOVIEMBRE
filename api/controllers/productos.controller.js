const prisma = require('../prisma');

const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
        receta: {
          include: {
            insumo: true
          }
        }
      }
    });
    // Formatear para que el frontend lo reciba de forma compatible
    const formateados = productos.map(p => ({
      ...p,
      categoriaNombre: p.categoria?.nombre || 'Sin Categoria',
      emoji: p.categoria?.emoji || '🍔', // O usar otra lógica
    }));
    res.json(formateados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Algunas pantallas envían categoriaId y otras sólo el nombre de la categoría.
// Devuelve undefined cuando no se envió ninguno, para no pisar la categoría existente al editar.
const resolverCategoriaId = async ({ categoriaId, categoriaNombre, categoria }) => {
  if (categoriaId !== undefined && categoriaId !== '') {
    return categoriaId === null ? null : parseInt(categoriaId);
  }
  const nombre = categoriaNombre || (typeof categoria === 'string' ? categoria : undefined);
  if (!nombre) return undefined;
  const cat = await prisma.categoria.findUnique({ where: { nombre } });
  return cat ? cat.id : undefined;
};

const createProducto = async (req, res) => {
  try {
    const { nombre, precio, imagenUrl, promptIA, receta, activo } = req.body;

    if (!nombre || isNaN(parseFloat(precio))) {
      return res.status(400).json({ error: 'Nombre y precio válido son obligatorios' });
    }

    // receta debe ser un array de { insumoId, cantidad }
    const categoriaId = await resolverCategoriaId(req.body);

    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        imagenUrl,
        promptIA,
        activo: activo !== undefined ? activo : true,
        categoriaId: categoriaId ?? null,
        receta: Array.isArray(receta) ? {
          create: receta.map(r => ({
            insumoId: parseInt(r.insumoId),
            cantidad: parseFloat(r.cantidad)
          }))
        } : undefined
      },
      include: {
        categoria: true,
        receta: {
          include: { insumo: true }
        }
      }
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagenUrl, promptIA, receta, activo } = req.body;

    if (precio !== undefined && isNaN(parseFloat(precio))) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    const categoriaId = await resolverCategoriaId(req.body);

    // Primero actualizamos los datos básicos y borramos receta antigua si se envía una nueva
    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        precio: precio !== undefined ? parseFloat(precio) : undefined,
        imagenUrl,
        promptIA,
        activo: activo !== undefined ? activo : undefined,
        categoriaId,
        // Si mandamos receta, recreamos las relaciones
        ...(Array.isArray(receta) && {
          receta: {
            deleteMany: {}, // Borramos las anteriores
            create: receta.map(r => ({
              insumoId: parseInt(r.insumoId),
              cantidad: parseFloat(r.cantidad)
            }))
          }
        })
      },
      include: {
        categoria: true,
        receta: {
          include: { insumo: true }
        }
      }
    });

    res.json(productoActualizado);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.producto.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
};
