// ─────────────────────────────────────────────────────────────────────────────
// Catálogo Base de la Rotisería - Única Fuente de Verdad Compartida
// Centraliza todos los productos, precios oficiales, acompañamientos, bebidas y reglas.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Costo editable por medallón de carne extra en hamburguesas.
 * Base = 2 medallones incluidos; permite de 2 a 4 medallones.
 */
export const PRECIO_MEDALLON_EXTRA = 1500;

/**
 * Formateador de precios oficial: "$20.000" (separador de miles con punto, sin decimales).
 */
export const formatPeso = (n) =>
  '$' + Math.round(Number(n) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });

export const CATEGORIAS_BASE = [
  'Platos Principales',
  'Bebidas'
];

/**
 * Precios oficiales de Acompañamientos (Paso 2 del modal)
 */
export const PRECIOS_ACOMPANAMIENTO = {
  papas_fritas: 8000,
  papas_cheddar: 10000,
  sin_acomp: 0,
};

/**
 * Configuración oficial de Bebidas (Paso 3 del modal)
 */
export const TAMANOS_GASEOSAS = [
  { id: 'lata', label: 'Lata', precio: 2800 },
  { id: '500ml', label: 'Botella 500 ml', precio: 3500 },
  { id: '1lt', label: '1 lt', precio: 4000 },
  { id: '1_25lts', label: '1,25 lts', precio: 4500 },
  { id: '2lts', label: '2 lts', precio: 7000 },
];

export const MARCAS_GASEOSAS = ['Coca Cola', 'Sprite', 'Fanta'];

export const OTRAS_BEBIDAS = [
  { id: 'cerveza_andes', nombre: 'Cerveza Andes', precio: 5000, requiereHielo: false },
  { id: 'vino_malbec', nombre: 'Vino Malbec', precio: 8000, requiereHielo: false },
  { id: 'vino_blanco', nombre: 'Vino Blanco', precio: 10000, requiereHielo: false },
  { id: 'agua', nombre: 'Agua', precio: 3000, requiereHielo: true },
  { id: 'soda', nombre: 'Soda', precio: 5000, requiereHielo: true },
];

/**
 * Listado Completo y Definitivo de Productos del Menú
 */
export const PRODUCTOS_INICIALES = [
  // ─── PLATOS PRINCIPALES (22 platos) ──────────────────────────────────────────
  {
    id: 1,
    nombre: 'Milanesa de carne',
    precio: 20000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Filete de nalga tierna con empanado crocante tradicional y rodajas de limón fresco.',
    imagenUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 2,
    nombre: 'Milanesa de carne a la napolitana',
    precio: 25000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Milanesa de nalga crocante cubierta con salsa de tomate casera, jamón cocido, abundante muzzarella fundida y orégano.',
    imagenUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 3,
    nombre: 'Milanesa de pollo',
    precio: 22000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Pechuga de pollo seleccionada, tierna y dorada a la perfección con pan rallado casero.',
    imagenUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 4,
    nombre: 'Milanesa de pollo a la napolitana',
    precio: 27000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Pechuga crocante con salsa de tomates maduros, queso muzzarella gratinado, jamón y orégano.',
    imagenUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 5,
    nombre: 'Milanesa (carne o pollo) con papas fritas',
    precio: 32000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Gran milanesa dorada (a elección carne o pollo) acompañada con abundante porción de papas fritas bastón crocantes.',
    imagenUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 6,
    nombre: 'Lomito completo',
    precio: 23000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Bife de lomo tierno a la plancha en pan artesanal tostado, con queso, huevo frito, jamón, panceta, lechuga, tomate y mayonesa.',
    imagenUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 7,
    nombre: 'Hamburguesa doble cheddar',
    precio: 12500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Doble medallón de carne, queso cheddar fundido, lechuga, tomate, cebolla, pepinillos y salsa a elección (Salsa Roti o Barbacoa).',
    imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 8,
    nombre: 'Pizza Muzzarella',
    precio: 18000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Clásica pizza artesanal con salsa de tomate casera, abundante muzzarella dorada, orégano y aceitunas.',
    imagenUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 9,
    nombre: 'Pizza Napolitana',
    precio: 20000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Muzzarella fundida, rodajas de tomate natural fresco, ajo picado, albahaca, orégano y aceitunas verdes.',
    imagenUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 10,
    nombre: 'Pizza Fugazzeta',
    precio: 22000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa dorada artesanal cubierta de abundante muzzarella fundida, cebollas caramelizadas, orégano y aceitunas.',
    imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 11,
    nombre: 'Pizza grande especial',
    precio: 24000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Salsa de tomate casera, muzzarella fundida, jamón cocido, morrón asado, huevo duro y aceitunas.',
    imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 12,
    nombre: 'Pizza con ananá',
    precio: 24000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Combinación agridulce especial con salsa de tomate casera, abundante muzzarella fundida y rodajas jugosas de ananá.',
    imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 13,
    nombre: 'Empanadas (docena)',
    precio: 16000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Docena de empanadas artesanales a elección: Carne tradicional, Jamón y queso o Pollo bien sazonado.',
    imagenUrl: 'https://images.unsplash.com/photo-1628106235973-45544414337b?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 14,
    nombre: 'Tarta de Jamón y Queso',
    precio: 18000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa hojaldrada dorada con generoso relleno de jamón cocido, queso cremoso fundido y suave ligue de crema.',
    imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 15,
    nombre: 'Tarta de Acelga y Queso',
    precio: 18000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa artesanal rellena de acelga fresca sazonada, queso fundido, huevo, crema de leche y nuez moscada.',
    imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 16,
    nombre: 'Tarta de Choclo y Humita',
    precio: 20000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Cremosa humita casera con granos de maíz dulce, queso derretido, cebolla, morrón y albahaca.',
    imagenUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 17,
    nombre: 'Tarta de Verdura',
    precio: 18000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa casera con relleno de zapallito tierno, zanahoria, cebolla, morrón, huevo, queso y crema de leche.',
    imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 18,
    nombre: 'Tarta de Verdura y pollo',
    precio: 20000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Tarta artesanal de verduras frescas seleccionadas con pollo desmenuzado, queso cremoso y crema.',
    imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 19,
    nombre: 'Ñoquis de Papa',
    precio: 16000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Ñoquis artesanales de papa servidos con salsa a elección (Tomate, Crema o Mixta) y queso rallado.',
    imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 20,
    nombre: 'Ravioles de Verdura y Carne',
    precio: 18000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Ravioles caseros rellenos de verdura y carne con salsa tradicional (Tomate o Bolognesa) y queso rallado.',
    imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 21,
    nombre: 'Papas fritas',
    precio: 8000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Porción clásica de papas fritas bastón, doradas y bien crocantes.',
    imagenUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 22,
    nombre: 'Papas con cheddar',
    precio: 10000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Porción de papas fritas crocantes bañadas en abundante salsa de queso cheddar fundido.',
    imagenUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
    activo: true
  },

  // ─── BEBIDAS (Catálogo General) ─────────────────────────────────────────────
  {
    id: 23,
    nombre: 'Coca Cola',
    precio: 4500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Gaseosa helada Coca Cola (disponible en Lata $2.800, 500ml $3.500, 1L $4.000, 1.25L $4.500, 2L $7.000).',
    imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 24,
    nombre: 'Sprite',
    precio: 4500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Gaseosa lima-limón helada (disponible en Lata $2.800, 500ml $3.500, 1L $4.000, 1.25L $4.500, 2L $7.000).',
    imagenUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 25,
    nombre: 'Fanta',
    precio: 4500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Gaseosa sabor naranja helada (disponible en Lata $2.800, 500ml $3.500, 1L $4.000, 1.25L $4.500, 2L $7.000).',
    imagenUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 26,
    nombre: 'Cerveza Andes',
    precio: 5000,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Cerveza rubia bien helada con espuma cremosa.',
    imagenUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 27,
    nombre: 'Vino Malbec',
    precio: 8000,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Vino tinto Malbec argentino de aroma intenso y gran cuerpo.',
    imagenUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 28,
    nombre: 'Vino Blanco',
    precio: 10000,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Vino blanco helado de sabor fresco y frutal.',
    imagenUrl: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 29,
    nombre: 'Agua',
    precio: 3000,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Agua mineral pura y fresca.',
    imagenUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 30,
    nombre: 'Soda',
    precio: 5000,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Sifón de agua con gas efervescente bien fría.',
    imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=600',
    activo: true
  }
];

const LS_KEY = 'rotiseria_productos';
const LS_MENU_VERSION_KEY = 'rotiseria_menu_version';
// Versión oficial definitiva del menú para invalidar cualquier caché local obsoleta
const VERSION_MENU_DEFINITIVA = '2026_MENU_DEFINITIVO_V2';

/** Lee los productos desde localStorage, asegurando precios oficiales definitivos */
export function leerProductos() {
  try {
    const versionActual = localStorage.getItem(LS_MENU_VERSION_KEY);
    const raw = localStorage.getItem(LS_KEY) || localStorage.getItem('products');

    // Si la versión no coincide o no hay datos, inicializamos con los precios oficiales definitivos
    if (versionActual !== VERSION_MENU_DEFINITIVA || !raw) {
      guardarProductos(PRODUCTOS_INICIALES);
      localStorage.setItem(LS_MENU_VERSION_KEY, VERSION_MENU_DEFINITIVA);
      return PRODUCTOS_INICIALES;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Sincronizamos precios oficiales con los productos guardados
      const mapaPreciosOficiales = new Map(
        PRODUCTOS_INICIALES.map((p) => [(p.nombre || '').toLowerCase().trim(), p])
      );

      const actualizados = parsed.map((p) => {
        const oficial = mapaPreciosOficiales.get((p?.nombre || '').toLowerCase().trim());
        if (oficial) {
          return {
            ...p,
            precio: oficial.precio,
            nombre: oficial.nombre,
            categoria: oficial.categoria,
            categoriaNombre: oficial.categoriaNombre,
            descripcion: oficial.descripcion,
            imagenUrl: oficial.imagenUrl,
          };
        }
        return p;
      });

      // Aseguramos que los 22 platos y bebidas existan
      const existentesNombres = new Set(actualizados.map((p) => (p?.nombre || '').toLowerCase().trim()));
      const faltantes = PRODUCTOS_INICIALES.filter(
        (pi) => !existentesNombres.has((pi?.nombre || '').toLowerCase().trim())
      );

      const listaFinal = faltantes.length > 0 ? [...actualizados, ...faltantes] : actualizados;
      guardarProductos(listaFinal);
      return listaFinal;
    }
  } catch (_) {}

  return PRODUCTOS_INICIALES;
}

/** Persiste la lista completa de productos en localStorage */
export function guardarProductos(lista) {
  try {
    if (Array.isArray(lista) && lista.length > 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(lista));
      localStorage.setItem('products', JSON.stringify(lista));
      localStorage.setItem(LS_MENU_VERSION_KEY, VERSION_MENU_DEFINITIVA);
    }
  } catch (_) {}
}
