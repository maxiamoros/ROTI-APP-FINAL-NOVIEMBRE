// 
// Catálogo base de la rotisería - Fuente de verdad compartida
// 

export const CATEGORIAS_BASE = [
  'Platos Principales',
  'Bebidas'
];

export const PRODUCTOS_INICIALES = [
  // Platos Principales
  {
    id: 1,
    nombre: 'Milanesa de carne',
    precio: 6500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Filete de nalga tierna con empanado crocante y rodajas de limón fresco.',
    imagenUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 2,
    nombre: 'Milanesa de carne a la napolitana',
    precio: 7500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Milanesa crocante cubierta con salsa fileto casera, jamón cocido, abundante mozzarella y orégano.',
    imagenUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 3,
    nombre: 'Milanesa de pollo',
    precio: 6000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Pechuga de pollo seleccionada, rebozada y dorada a la perfección.',
    imagenUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 4,
    nombre: 'Milanesa de pollo a la napolitana',
    precio: 7000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Pechuga crocante con salsa de tomates maduros, queso mozzarella gratinado y jamón.',
    imagenUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 5,
    nombre: 'Milanesa (carne o pollo) con papas fritas',
    precio: 8500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Gran milanesa dorada acompañada con papas fritas bastón crocantes.',
    imagenUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 6,
    nombre: 'Lomito completo',
    precio: 8900,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Bife de lomo tierno a la plancha en pan artesanal tostado, con queso, huevo frito, jamón, lechuga y tomate.',
    imagenUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 7,
    nombre: 'Pizza Fugazzeta',
    precio: 7800,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa dorada artesanal cubierta de abundante mozzarella fundida y cebollas caramelizadas.',
    imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 8,
    nombre: 'Pizza Napolitana',
    precio: 8200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Mozzarella fundida, rodajas de tomate natural fresco, ajo picado, albahaca y aceitunas verdes.',
    imagenUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 9,
    nombre: 'Pizza Muzzarella',
    precio: 7000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Clásica pizza artesanal con salsa de tomate especial, abundante mozzarella dorada y aceitunas.',
    imagenUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 10,
    nombre: 'Pizza Con ananá',
    precio: 8500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Combinación agridulce de mozzarella fundida, jamón cocido y trozos jugosos de ananá.',
    imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 11,
    nombre: 'Tarta de Jamón y Queso',
    precio: 4200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa hojaldrada dorada con generoso relleno de jamón cocido y queso cremoso derretido.',
    imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 12,
    nombre: 'Tarta de Acelga y Queso',
    precio: 4000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Masa artesanal rellena de acelga fresca sazonada y suave queso gratinado.',
    imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 13,
    nombre: 'Tarta de Choclo y Humita',
    precio: 4200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Cremosa humita casera con granos de maíz dulce y queso mozzarella doradito.',
    imagenUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 14,
    nombre: 'Ñoquis de Papa',
    precio: 6200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Ñoquis artesanales de papa servidos con abundante tuco casero y queso parmesano rallado.',
    imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 15,
    nombre: 'Ravioles de Verdura y Carne',
    precio: 6800,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    descripcion: 'Ravioles caseros rellenos de verdura y carne con salsa boloñesa tradicional.',
    imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    activo: true
  },

  // Bebidas
  {
    id: 16,
    nombre: 'Coca Cola 1.25 Lts',
    precio: 2500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Gaseosa helada Coca Cola Original en botella de 1.25 Lts.',
    imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 17,
    nombre: 'Sprite',
    precio: 2400,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Gaseosa lima-limón helada y refrescante.',
    imagenUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 18,
    nombre: 'Fanta',
    precio: 2400,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Refrescante gaseosa con sabor a fruta de naranja.',
    imagenUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 19,
    nombre: 'Cerveza Andes',
    precio: 3200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Cerveza rubia bien helada con espuma cremosa.',
    imagenUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 20,
    nombre: 'Vino Malbec',
    precio: 4500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Vino tinto Malbec argentino de aroma intenso y gran cuerpo.',
    imagenUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 21,
    nombre: 'Vino Blanco',
    precio: 4200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Vino blanco helado de sabor fresco y frutal.',
    imagenUrl: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 22,
    nombre: 'Agua',
    precio: 1200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Agua mineral pura y fresca sin gas.',
    imagenUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    activo: true
  },
  {
    id: 23,
    nombre: 'Soda',
    precio: 1500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    descripcion: 'Sifón de agua con gas efervescente bien fría.',
    imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=600',
    activo: true
  }
];

const LS_KEY = 'rotiseria_productos';

/** Lee los productos desde localStorage, o devuelve los iniciales */
export function leerProductos() {
  try {
    const raw = localStorage.getItem(LS_KEY) || localStorage.getItem('products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
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
    }
  } catch (_) {}
}
