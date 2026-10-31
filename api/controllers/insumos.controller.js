const prisma = require('../prisma');

// stock y stockMinimo son Int en la base: el frontend puede mandar strings o decimales
const aEntero = (valor) => {
  if (valor === undefined || valor === null || valor === '') return undefined;
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : NaN;
};

const getInsumos = async (req, res) => {
  try {
    const insumos = await prisma.insumo.findMany();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener insumos' });
  }
};

const createInsumo = async (req, res) => {
  try {
    const { nombre, stock, stockMinimo } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const stockInt = aEntero(stock);
    const stockMinimoInt = aEntero(stockMinimo);
    if (Number.isNaN(stockInt) || Number.isNaN(stockMinimoInt)) {
      return res.status(400).json({ error: 'Stock inválido' });
    }

    const nuevo = await prisma.insumo.create({
      data: {
        nombre,
        stock: stockInt ?? 0,
        stockMinimo: stockMinimoInt ?? 0
      }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear insumo' });
  }
};

const updateInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, stock, stockMinimo } = req.body;

    const stockInt = aEntero(stock);
    const stockMinimoInt = aEntero(stockMinimo);
    if (Number.isNaN(stockInt) || Number.isNaN(stockMinimoInt)) {
      return res.status(400).json({ error: 'Stock inválido' });
    }

    const actualizado = await prisma.insumo.update({
      where: { id: parseInt(id) },
      data: { nombre, stock: stockInt, stockMinimo: stockMinimoInt }
    });
    res.json(actualizado);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Insumo no encontrado' });
    res.status(500).json({ error: 'Error al actualizar insumo' });
  }
};

const deleteInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if it's used in recipes
    const recetasUsando = await prisma.recetaItem.count({ where: { insumoId: parseInt(id) } });
    if (recetasUsando > 0) {
      return res.status(400).json({ error: 'No se puede eliminar porque está siendo usado en recetas' });
    }
    
    await prisma.insumo.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Insumo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar insumo' });
  }
};

module.exports = {
  getInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo
};
