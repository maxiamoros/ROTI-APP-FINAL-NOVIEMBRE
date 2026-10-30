const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed del menú oficial completo y definitivo...');

  // 1. Crear Categorías Principales
  const categoriasBase = [
    { nombre: 'Platos Principales', emoji: '🍽️' },
    { nombre: 'Bebidas', emoji: '🥤' }
  ];

  const categoriasDb = {};
  for (const cat of categoriasBase) {
    const creada = await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: { emoji: cat.emoji, activo: true },
      create: { nombre: cat.nombre, emoji: cat.emoji, activo: true }
    });
    categoriasDb[creada.nombre] = creada;
  }
  console.log('✅ Categorías preparadas.');

  // Desactivar temporalmente cualquier producto viejo no oficial
  await prisma.producto.updateMany({
    data: { activo: false }
  });

  // 2. Definición completa y definitiva del menú oficial
  const productosBase = [
    // --- PLATOS PRINCIPALES (22 Platos Oficiales) ---
    {
      nombre: 'Milanesa de carne',
      precio: 20000,
      imagenUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Milanesa de carne tierno con empanado crocante y rodajas de limón fresco.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de carne a la napolitana',
      precio: 25000,
      imagenUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Milanesa crocante cubierta con salsa fileto casera, jamón cocido, abundante mozzarella y orégano.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de pollo',
      precio: 22000,
      imagenUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Pechuga de pollo seleccionada, rebozada y dorada a la perfección.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de pollo a la napolitana',
      precio: 27000,
      imagenUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Pechuga crocante con salsa de tomates maduros, queso mozzarella gratinado y jamón.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa (carne o pollo) con papas fritas',
      precio: 32000,
      imagenUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Gran milanesa dorada acompañada con papas fritas bastón crocantes.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Lomito completo',
      precio: 23000,
      imagenUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Bife de lomo tierno a la plancha en pan artesanal tostado, con queso, huevo frito, jamón, lechuga y tomate.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Hamburguesa doble cheddar',
      precio: 12500,
      imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Hamburguesa con doble medallón de carne, queso cheddar fundido, lechuga, tomate y pepinillos.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Muzzarella',
      precio: 18000,
      imagenUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Clásica pizza artesanal con salsa de tomate especial, abundante mozzarella dorada y aceitunas.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Napolitana',
      precio: 20000,
      imagenUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Mozzarella fundida, rodajas de tomate natural fresco, ajo picado, albahaca y aceitunas verdes.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Fugazzeta',
      precio: 22000,
      imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Masa dorada artesanal cubierta de abundante mozzarella fundida y cebollas caramelizadas.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza grande especial',
      precio: 24000,
      imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Pizza grande especial con salsa de tomate casera, muzzarella, jamón, morrones y aceitunas.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza con ananá',
      precio: 24000,
      imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Pizza artesanal con rodajas jugosas de ananá, abundante mozzarella fundida y salsa de tomate.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Empanadas (docena)',
      precio: 16000,
      imagenUrl: 'https://images.unsplash.com/photo-1628106235973-45544414337b?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Docena de empanadas artesanales doradas al horno.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Jamón y Queso',
      precio: 18000,
      imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Masa hojaldrada dorada con generoso relleno de jamón cocido y queso cremoso derretido.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Acelga y Queso',
      precio: 18000,
      imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Masa artesanal rellena de acelga fresca sazonada y suave queso gratinado.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Choclo y Humita',
      precio: 20000,
      imagenUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Cremosa humita casera con granos de maíz dulce y queso mozzarella doradito.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Verdura',
      precio: 18000,
      imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Tarta casera de verduras frescas y queso derretido.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Verdura y pollo',
      precio: 20000,
      imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Tarta hojaldrada con verduras salteadas y pollo desmenuzado.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Ñoquis de Papa',
      precio: 16000,
      imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Ñoquis artesanales de papa servidos con salsa casera y queso parmesano rallado.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Ravioles de Verdura y Carne',
      precio: 18000,
      imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Ravioles caseros rellenos de verdura y carne con salsa tradicional.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Papas fritas',
      precio: 8000,
      imagenUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Porción clásica de papas fritas bastón doradas y crocantes.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Papas con cheddar',
      precio: 10000,
      imagenUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Papas fritas crocantes bañadas en salsa de queso cheddar fundido.',
      categoriaNombre: 'Platos Principales'
    },

    // --- BEBIDAS OFICIALES ---
    {
      nombre: 'Coca Cola',
      precio: 4500,
      imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Gaseosa helada Coca Cola Original en botella.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Sprite',
      precio: 4500,
      imagenUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Gaseosa lima-limón helada y refrescante.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Fanta',
      precio: 4500,
      imagenUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Refrescante gaseosa con sabor a fruta de naranja.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Cerveza Andes',
      precio: 5000,
      imagenUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Cerveza rubia bien helada con espuma cremosa.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Vino Malbec',
      precio: 8000,
      imagenUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Vino tinto Malbec argentino de aroma intenso y gran cuerpo.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Vino Blanco',
      precio: 10000,
      imagenUrl: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Vino blanco helado de sabor fresco y frutal.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Agua',
      precio: 3000,
      imagenUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Agua mineral pura y fresca sin gas.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Soda',
      precio: 5000,
      imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=600',
      promptIA: 'Sifón de agua con gas efervescente bien fría.',
      categoriaNombre: 'Bebidas'
    }
  ];

  for (const prod of productosBase) {
    const categoria = categoriasDb[prod.categoriaNombre];
    if (!categoria) continue;

    const data = {
      nombre: prod.nombre,
      precio: prod.precio,
      imagenUrl: prod.imagenUrl,
      promptIA: prod.promptIA,
      categoriaId: categoria.id,
      activo: true
    };

    // Buscamos coincidencia exacta o por nombre similar (ej. Pizza Con ananá -> Pizza con ananá)
    const dbProd = await prisma.producto.findFirst({
      where: {
        OR: [
          { nombre: prod.nombre },
          { nombre: { equals: prod.nombre } }
        ]
      }
    });

    if (!dbProd) {
      await prisma.producto.create({ data });
      console.log(`✅ Producto creado: ${prod.nombre} - $${prod.precio}`);
    } else {
      await prisma.producto.update({
        where: { id: dbProd.id },
        data
      });
      console.log(`🔄 Producto actualizado: ${prod.nombre} - $${prod.precio}`);
    }
  }

  // Ocultar productos obsoletos que no pertenezcan al menú oficial
  const nombresOficiales = productosBase.map(p => p.nombre.toLowerCase().trim());
  const todosEnDb = await prisma.producto.findMany();
  for (const item of todosEnDb) {
    if (!nombresOficiales.includes(item.nombre.toLowerCase().trim())) {
      await prisma.producto.update({
        where: { id: item.id },
        data: { activo: false }
      });
      console.log(`🚫 Producto deshabilitado/oculto: ${item.nombre}`);
    }
  }

  console.log('🎉 Seed del menú oficial completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
