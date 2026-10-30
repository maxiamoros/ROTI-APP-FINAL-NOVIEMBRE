// ─────────────────────────────────────────────────────────────────────────────
// Catálogo de Ingredientes y Configuración de Personalización de Pedidos
// Archivo único y centralizado para editar ingredientes, salsas, descripciones,
// precios de medallones extra, bebidas y acompañamientos.
// ─────────────────────────────────────────────────────────────────────────────

import {
  PRECIOS_ACOMPANAMIENTO,
  TAMANOS_GASEOSAS,
  MARCAS_GASEOSAS,
  OTRAS_BEBIDAS,
} from './productos';

/**
 * Costo adicional por cada medallón de carne extra en la hamburguesa.
 * (El precio base incluye 2 medallones, permite de 2 a 4).
 */
export const PRECIO_MEDALLON_EXTRA = 1500;

/**
 * Descripciones cortas editables para las salsas.
 * Se muestran en el modal debajo del nombre en letra chica y atenuada.
 * Si el campo está vacío (""), no se muestra.
 * En el ticket y WhatsApp solo se imprime el nombre de la salsa.
 */
export const DESCRIPCIONES_SALSAS = {
  'Salsa Roti': 'Mayonesa, ketchup, pepinillos picados y un toque de mostaza.',
  'Barbacoa': 'Salsa ahumada y agridulce a base de tomate.',
  'Tomate': 'Salsa de tomates maduros con albahaca y aceite de oliva.',
  'Crema': 'Salsa suave a base de crema de leche y hierbas.',
  'Mixta': 'Combinación clásica de salsa de tomate y crema suave.',
  'Bolognesa': 'Salsa de tomate con carne picada seleccionada y especias.',
};

/**
 * Catálogo central de ingredientes por producto:
 * - fijos: Ingredientes que definen el producto. NO se pueden destildar (se muestran como "Incluye:").
 * - opcionales: Ingredientes que el cliente puede destildar como checkbox (todos tildados por defecto).
 * - tieneMedallones: Booleano para activar el contador de medallones (2 a 4).
 * - opciones: Opciones de selección única (radio), ej. salsas o tipo de carne.
 * - variedades: Para productos como empanadas que dividen sus fijos y opcionales por sabor.
 */
export const DATOS_INGREDIENTES = {
  hamburguesa_doble_cheddar: {
    nombre: 'Hamburguesa doble cheddar',
    tieneMedallones: true,
    medallonesBase: 2,
    medallonesMin: 2,
    medallonesMax: 4,
    fijos: ['Queso cheddar'],
    opcionales: ['Lechuga', 'Tomate', 'Cebolla', 'Pepinillos'],
    opciones: [
      {
        id: 'salsa',
        titulo: 'Salsa',
        default: 'Salsa Roti',
        valores: [
          {
            nombre: 'Salsa Roti',
            descripcion: DESCRIPCIONES_SALSAS['Salsa Roti'],
          },
          {
            nombre: 'Barbacoa',
            descripcion: DESCRIPCIONES_SALSAS['Barbacoa'],
          },
        ],
      },
    ],
  },

  lomito_completo: {
    nombre: 'Lomito completo',
    fijos: ['Bife de lomo'],
    opcionales: [
      'Jamón',
      'Queso',
      'Huevo frito',
      'Panceta',
      'Lechuga',
      'Tomate',
      'Mayonesa',
    ],
    opciones: [],
  },

  pizza_muzzarella: {
    nombre: 'Pizza Muzzarella',
    fijos: ['Salsa de tomate', 'Muzzarella'],
    opcionales: ['Orégano', 'Aceitunas'],
    opciones: [],
  },

  pizza_napolitana: {
    nombre: 'Pizza Napolitana',
    fijos: ['Salsa de tomate', 'Muzzarella', 'Rodajas de tomate'],
    opcionales: ['Ajo', 'Orégano', 'Albahaca', 'Aceitunas'],
    opciones: [],
  },

  pizza_especial: {
    nombre: 'Pizza grande especial',
    fijos: ['Salsa de tomate', 'Muzzarella', 'Jamón'],
    opcionales: ['Morrón', 'Huevo duro', 'Aceitunas'],
    opciones: [],
  },

  pizza_fugazzeta: {
    nombre: 'Pizza Fugazzeta',
    fijos: ['Muzzarella', 'Cebolla'],
    opcionales: ['Orégano', 'Aceitunas'],
    opciones: [],
  },

  pizza_anana: {
    nombre: 'Pizza con ananá',
    fijos: ['Salsa de tomate', 'Muzzarella', 'Ananá'],
    opcionales: ['Orégano'],
    opciones: [],
  },

  empanadas_docena: {
    nombre: 'Empanadas (docena)',
    opciones: [
      {
        id: 'variedad',
        titulo: 'Variedad de empanadas',
        default: 'Carne tradicional',
        valores: [
          { nombre: 'Carne tradicional', descripcion: '' },
          { nombre: 'Jamón y queso', descripcion: '' },
          { nombre: 'Pollo', descripcion: '' },
        ],
      },
    ],
    variedades: {
      'Carne tradicional': {
        fijos: ['Carne picada'],
        opcionales: [
          'Cebolla',
          'Cebolla de verdeo',
          'Huevo duro',
          'Aceitunas',
          'Pimentón',
          'Comino',
          'Ají molido',
        ],
      },
      'Jamón y queso': {
        fijos: ['Jamón cocido', 'Muzzarella'],
        opcionales: [], // Todo fijo, sin opcionales
      },
      'Pollo': {
        fijos: ['Pollo desmenuzado'],
        opcionales: ['Cebolla', 'Morrón', 'Cebolla de verdeo', 'Especias'],
      },
    },
  },

  milanesa_comun: {
    nombre: 'Milanesa común',
    opciones: [
      {
        id: 'tipo_carne',
        titulo: 'Tipo de carne',
        default: 'Carne vacuna (nalga o peceto)',
        valores: [
          { nombre: 'Carne vacuna (nalga o peceto)', descripcion: '' },
          { nombre: 'Pechuga de pollo', descripcion: '' },
        ],
      },
    ],
    fijos: ['Carne vacuna o pechuga de pollo', 'Huevo', 'Pan rallado'],
    opcionales: ['Ajo', 'Perejil'],
  },

  milanesa_napolitana: {
    nombre: 'Milanesa a la napolitana',
    opciones: [
      {
        id: 'tipo_carne',
        titulo: 'Tipo de carne',
        default: 'Carne vacuna (nalga o peceto)',
        valores: [
          { nombre: 'Carne vacuna (nalga o peceto)', descripcion: '' },
          { nombre: 'Pechuga de pollo', descripcion: '' },
        ],
      },
    ],
    fijos: [
      'Carne vacuna o pechuga de pollo',
      'Huevo',
      'Pan rallado',
      'Salsa de tomate',
      'Muzzarella',
    ],
    opcionales: ['Jamón', 'Orégano', 'Ajo', 'Perejil'],
  },

  papas_fritas: {
    nombre: 'Papas fritas',
    fijos: ['Papas', 'Aceite'],
    opcionales: ['Sal'],
    opciones: [],
  },

  papas_cheddar: {
    nombre: 'Papas con cheddar',
    fijos: ['Papas', 'Aceite', 'Queso cheddar'],
    opcionales: ['Sal'],
    opciones: [],
  },

  tarta_verdura: {
    nombre: 'Tarta de Verdura',
    fijos: ['Zapallito', 'Zanahoria', 'Huevo', 'Queso', 'Crema de leche'],
    opcionales: ['Cebolla', 'Morrón'],
    opciones: [],
  },

  tarta_verdura_pollo: {
    nombre: 'Tarta de Verdura y pollo',
    fijos: [
      'Zapallito',
      'Zanahoria',
      'Pollo desmenuzado',
      'Huevo',
      'Queso',
      'Crema de leche',
    ],
    opcionales: ['Cebolla', 'Morrón'],
    opciones: [],
  },

  tarta_jamon_queso: {
    nombre: 'Tarta de Jamón y Queso',
    fijos: ['Jamón cocido', 'Queso', 'Huevo', 'Crema de leche'],
    opcionales: [], // Todo fijo
    opciones: [],
  },

  tarta_acelga_queso: {
    nombre: 'Tarta de Acelga y Queso',
    fijos: ['Acelga', 'Queso', 'Huevo', 'Crema de leche'],
    opcionales: ['Cebolla', 'Nuez moscada'],
    opciones: [],
  },

  tarta_choclo_humita: {
    nombre: 'Tarta de Choclo y Humita',
    fijos: ['Choclo', 'Queso', 'Huevo', 'Crema de leche'],
    opcionales: ['Cebolla', 'Morrón', 'Albahaca', 'Pimentón'],
    opciones: [],
  },

  noquis_papa: {
    nombre: 'Ñoquis de Papa',
    fijos: ['Papa', 'Harina', 'Huevo'],
    opcionales: ['Queso rallado'],
    opciones: [
      {
        id: 'salsa',
        titulo: 'Salsa',
        default: 'Tomate',
        valores: [
          { nombre: 'Tomate', descripcion: DESCRIPCIONES_SALSAS['Tomate'] },
          { nombre: 'Crema', descripcion: DESCRIPCIONES_SALSAS['Crema'] },
          { nombre: 'Mixta', descripcion: DESCRIPCIONES_SALSAS['Mixta'] },
        ],
      },
    ],
  },

  ravioles_verdura_carne: {
    nombre: 'Ravioles de Verdura y Carne',
    fijos: ['Relleno de verdura y carne'],
    opcionales: ['Queso rallado'],
    opciones: [
      {
        id: 'salsa',
        titulo: 'Salsa',
        default: 'Tomate',
        valores: [
          { nombre: 'Tomate', descripcion: DESCRIPCIONES_SALSAS['Tomate'] },
          { nombre: 'Bolognesa', descripcion: DESCRIPCIONES_SALSAS['Bolognesa'] },
        ],
      },
    ],
  },
};

/** Re-exportamos para conveniencia del modal */
export { TAMANOS_GASEOSAS, MARCAS_GASEOSAS, OTRAS_BEBIDAS };

/** Normaliza texto eliminando acentos y mayúsculas */
export function normalizarTexto(txt = '') {
  return String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Verifica si un producto es una bebida */
export function esBebida(producto) {
  if (!producto) return false;
  const cat = normalizarTexto(producto.categoriaNombre || producto.categoria || '');
  if (cat.includes('bebida')) return true;
  const n = normalizarTexto(producto.nombre || '');
  return ['coca cola', 'sprite', 'fanta', 'cerveza', 'vino', 'agua', 'soda'].some((b) => n.includes(b));
}

/**
 * Verifica si un producto incluye papas o ya es papas.
 * Si es verdadero, el paso 2 de acompañamiento NO debe mostrarse.
 */
export function productoIncluyePapas(producto) {
  if (!producto || !producto.nombre) return false;
  const n = normalizarTexto(producto.nombre);
  return (
    n.includes('papas fritas') ||
    n.includes('papas con cheddar') ||
    n.includes('papas cheddar') ||
    n.includes('c/ papas') ||
    n.includes('c/ fritas') ||
    n.includes('con papas') ||
    n.includes('con fritas') ||
    n.includes('porcion de papas') ||
    (n.includes('papas') && !n.includes('noquis'))
  );
}

/** Obtiene la configuración completa de ingredientes para un producto */
export function obtenerConfigProducto(producto) {
  if (!producto || !producto.nombre) return null;
  const n = normalizarTexto(producto.nombre);

  // Hamburguesa
  if (n.includes('hamburguesa')) {
    return DATOS_INGREDIENTES.hamburguesa_doble_cheddar;
  }

  // Lomito
  if (n.includes('lomito')) {
    return DATOS_INGREDIENTES.lomito_completo;
  }

  // Empanadas
  if (n.includes('empanada')) {
    return DATOS_INGREDIENTES.empanadas_docena;
  }

  // Pizzas
  if (n.includes('anana') || n.includes('hawai')) {
    return DATOS_INGREDIENTES.pizza_anana;
  }
  if (n.includes('fugazzeta')) {
    return DATOS_INGREDIENTES.pizza_fugazzeta;
  }
  if (n.includes('napolitana') && (n.includes('pizza') || !n.includes('milanesa'))) {
    return DATOS_INGREDIENTES.pizza_napolitana;
  }
  if (n.includes('especial') && (n.includes('pizza') || !n.includes('milanesa'))) {
    return DATOS_INGREDIENTES.pizza_especial;
  }
  if (n.includes('muzzarella') || n.includes('mozzarella') || n.includes('pizza')) {
    return DATOS_INGREDIENTES.pizza_muzzarella;
  }

  // Milanesas
  if (n.includes('milanesa')) {
    const esNapo = n.includes('napolitana');
    const base = esNapo ? DATOS_INGREDIENTES.milanesa_napolitana : DATOS_INGREDIENTES.milanesa_comun;

    let defaultCarne = 'Carne vacuna (nalga o peceto)';
    let textoCarneFija = 'Carne vacuna';
    if (n.includes('pollo')) {
      defaultCarne = 'Pechuga de pollo';
      textoCarneFija = 'Pechuga de pollo';
    } else if (n.includes('carne')) {
      defaultCarne = 'Carne vacuna (nalga o peceto)';
      textoCarneFija = 'Carne vacuna';
    }

    const fijos = base.fijos.map((f) =>
      f === 'Carne vacuna o pechuga de pollo' ? textoCarneFija : f
    );

    if (n.includes('papas') || n.includes('fritas')) {
      fijos.push('Papas fritas');
    }

    return {
      ...base,
      fijos,
      opciones: base.opciones.map((op) =>
        op.id === 'tipo_carne' ? { ...op, default: defaultCarne } : op
      ),
    };
  }

  // Papas
  if (n.includes('cheddar') && n.includes('papa')) {
    return DATOS_INGREDIENTES.papas_cheddar;
  }
  if (n.includes('papa') && (n.includes('frita') || n.includes('baston'))) {
    return DATOS_INGREDIENTES.papas_fritas;
  }

  // Tartas
  if (n.includes('tarta')) {
    if (n.includes('verdura') && n.includes('pollo')) return DATOS_INGREDIENTES.tarta_verdura_pollo;
    if (n.includes('verdura')) return DATOS_INGREDIENTES.tarta_verdura;
    if (n.includes('jamon') || n.includes('jamón')) return DATOS_INGREDIENTES.tarta_jamon_queso;
    if (n.includes('acelga')) return DATOS_INGREDIENTES.tarta_acelga_queso;
    if (n.includes('choclo') || n.includes('humita')) return DATOS_INGREDIENTES.tarta_choclo_humita;
  }

  // Pastas
  if (n.includes('noqui') || n.includes('ñoqui')) {
    return DATOS_INGREDIENTES.noquis_papa;
  }
  if (n.includes('raviol')) {
    return DATOS_INGREDIENTES.ravioles_verdura_carne;
  }

  return null;
}

/**
 * Obtiene lista oficial de acompañamientos sincronizada con el menú:
 * - Papas fritas: +$8.000
 * - Papas con cheddar: +$10.000
 * - Sin acompañamiento: $0
 */
export function obtenerOpcionesAcompanamiento(productosMenu = []) {
  const lista = Array.isArray(productosMenu) ? productosMenu : [];

  const prodFritas = lista.find((p) => {
    const n = normalizarTexto(p.nombre);
    return (n.includes('papas fritas') || n === 'papas') && !n.includes('cheddar') && !n.includes('milanesa');
  });

  const prodCheddar = lista.find((p) => {
    const n = normalizarTexto(p.nombre);
    return n.includes('cheddar') && n.includes('papa');
  });

  const precioFritas = prodFritas && Number(prodFritas.precio) > 0
    ? Number(prodFritas.precio)
    : PRECIOS_ACOMPANAMIENTO.papas_fritas;

  const precioCheddar = prodCheddar && Number(prodCheddar.precio) > 0
    ? Number(prodCheddar.precio)
    : PRECIOS_ACOMPANAMIENTO.papas_cheddar;

  return [
    {
      id: 'sin_acomp',
      nombre: 'Sin acompañamiento',
      precio: 0,
      descripcion: 'Continuar sin agregar papas extra',
    },
    {
      id: 'papas_fritas',
      nombre: 'Papas fritas',
      precio: precioFritas,
      descripcion: 'Porción clásica dorada y crocante (+ $8.000)',
      imagenUrl: prodFritas?.imagenUrl || 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'papas_cheddar',
      nombre: 'Papas con cheddar',
      precio: precioCheddar,
      descripcion: 'Papas crocantes bañadas en queso cheddar fundido (+ $10.000)',
      imagenUrl: prodCheddar?.imagenUrl || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
    },
  ];
}
