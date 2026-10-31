const PORT = process.env.PORT || 3001;

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'RotiApp API',
    version: '1.0.0',
    description:
      'API REST de Rotisería Central (RotiApp): autenticación, catálogo, ventas/POS, inventario, usuarios, configuración y asistente IA.',
    contact: {
      name: 'Maximiliano Amorós',
      email: 'maxiamoros123@gmail.com',
    },
  },
  servers: [
    { url: `http://localhost:${PORT}`, description: 'Desarrollo local' },
    { url: '/', description: 'Servidor actual / proxy Vite' },
  ],
  tags: [
    { name: 'Auth', description: 'Login, Google OAuth y logout' },
    { name: 'Productos', description: 'Catálogo de platos y combos' },
    { name: 'Categorias', description: 'Secciones del menú' },
    { name: 'Ventas', description: 'Pedidos y punto de venta' },
    { name: 'Insumos', description: 'Inventario de materia prima' },
    { name: 'Usuarios', description: 'Personal y roles' },
    { name: 'Config', description: 'Configuración del local / tótem' },
    { name: 'Upload', description: 'Subida de imágenes' },
    { name: 'Chat', description: 'Asistente RotiAI (Gemini)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido en /api/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string' },
          rol: {
            type: 'string',
            enum: ['ADMIN', 'GERENTE', 'COCINERO', 'CAJERO', 'TOTEM', 'CLIENTE'],
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', example: 'admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/Usuario' },
        },
      },
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string', example: 'Platos Principales' },
          emoji: { type: 'string', example: '🍽️' },
          activo: { type: 'boolean' },
        },
      },
      RecetaItemInput: {
        type: 'object',
        properties: {
          insumoId: { type: 'integer' },
          cantidad: { type: 'number' },
        },
      },
      Producto: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string' },
          precio: { type: 'number' },
          imagenUrl: { type: 'string', nullable: true },
          promptIA: { type: 'string', nullable: true },
          activo: { type: 'boolean' },
          categoriaId: { type: 'integer', nullable: true },
          categoriaNombre: { type: 'string' },
          emoji: { type: 'string' },
        },
      },
      ProductoInput: {
        type: 'object',
        required: ['nombre', 'precio'],
        properties: {
          nombre: { type: 'string' },
          precio: { type: 'number' },
          imagenUrl: { type: 'string' },
          promptIA: { type: 'string' },
          activo: { type: 'boolean' },
          categoriaId: { type: 'integer', nullable: true },
          receta: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecetaItemInput' },
          },
        },
      },
      Insumo: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string' },
          stock: { type: 'integer' },
          stockMinimo: { type: 'integer' },
        },
      },
      PedidoItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID del producto' },
          cantidad: { type: 'integer' },
          nombre: { type: 'string' },
          precio: { type: 'number' },
        },
      },
      VentaInput: {
        type: 'object',
        required: ['items', 'total', 'metodo'],
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/PedidoItem' },
          },
          total: { type: 'number' },
          metodo: { type: 'string', example: 'efectivo' },
          estado: { type: 'string', example: 'completado' },
        },
      },
      Pedido: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          total: { type: 'number' },
          estado: { type: 'string' },
          fecha: { type: 'string', format: 'date-time' },
          items: { type: 'string', description: 'JSON stringificado de los ítems' },
        },
      },
      ChatRequest: {
        type: 'object',
        required: ['mensaje'],
        properties: {
          mensaje: { type: 'string', example: '¿Qué milanesas tienen?' },
          historial: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      ConfigItem: {
        type: 'object',
        properties: {
          clave: { type: 'string' },
          valor: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api': {
      get: {
        tags: ['Auth'],
        summary: 'Health check de la API',
        responses: {
          200: {
            description: 'API disponible',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    method: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login con usuario y contraseña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/api/auth/google': {
      post: {
        tags: ['Auth'],
        summary: 'Login con Google OAuth',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['credential'],
                properties: {
                  credential: { type: 'string', description: 'ID token de Google' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          403: { description: 'Email no autorizado (whitelist)' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesión',
        responses: {
          200: { description: 'Logout OK' },
        },
      },
    },
    '/api/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Listar productos (público)',
        responses: {
          200: {
            description: 'Lista de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Producto' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Productos'],
        summary: 'Crear producto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductoInput' },
            },
          },
        },
        responses: {
          201: { description: 'Producto creado' },
          401: { description: 'No autorizado' },
          403: { description: 'Requiere rol ADMIN/GERENTE' },
        },
      },
    },
    '/api/productos/{id}': {
      put: {
        tags: ['Productos'],
        summary: 'Actualizar producto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductoInput' },
            },
          },
        },
        responses: {
          200: { description: 'Producto actualizado' },
          401: { description: 'No autorizado' },
        },
      },
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar producto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Producto eliminado' },
          401: { description: 'No autorizado' },
        },
      },
    },
    '/api/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Listar categorías',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de categorías',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Categoria' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categorias'],
        summary: 'Crear categoría',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Categoria' },
            },
          },
        },
        responses: {
          201: { description: 'Categoría creada' },
          400: { description: 'Nombre inválido o duplicado' },
        },
      },
    },
    '/api/categorias/{id}': {
      put: {
        tags: ['Categorias'],
        summary: 'Actualizar categoría',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Categoria' },
            },
          },
        },
        responses: {
          200: { description: 'Categoría actualizada' },
        },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Eliminar categoría',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Categoría eliminada' },
          400: { description: 'Tiene productos asignados' },
        },
      },
    },
    '/api/ventas': {
      get: {
        tags: ['Ventas'],
        summary: 'Listar ventas/pedidos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de pedidos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Pedido' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Ventas'],
        summary: 'Crear venta/pedido (portal o caja)',
        description: 'Descuenta stock de insumos según escandallo de recetas.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VentaInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Venta registrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          400: { description: 'Datos inválidos' },
        },
      },
    },
    '/api/insumos': {
      get: {
        tags: ['Insumos'],
        summary: 'Listar insumos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de insumos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Insumo' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Insumos'],
        summary: 'Crear insumo',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Insumo' },
            },
          },
        },
        responses: {
          201: { description: 'Insumo creado' },
        },
      },
    },
    '/api/insumos/{id}': {
      put: {
        tags: ['Insumos'],
        summary: 'Actualizar insumo',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Insumo' },
            },
          },
        },
        responses: {
          200: { description: 'Insumo actualizado' },
        },
      },
      delete: {
        tags: ['Insumos'],
        summary: 'Eliminar insumo',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Insumo eliminado' },
          400: { description: 'En uso en recetas' },
        },
      },
    },
    '/api/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Usuario' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  rol: { type: 'string', example: 'CAJERO' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario creado' },
          400: { description: 'Usuario duplicado' },
        },
      },
    },
    '/api/usuarios/{id}': {
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  rol: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Usuario actualizado' },
        },
      },
    },
    '/api/config': {
      get: {
        tags: ['Config'],
        summary: 'Obtener configuración (clave → valor)',
        responses: {
          200: {
            description: 'Objeto de configuración',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: { type: 'string' },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Config'],
        summary: 'Actualizar una clave de configuración',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConfigItem' },
            },
          },
        },
        responses: {
          200: { description: 'Configuración actualizada' },
        },
      },
    },
    '/api/config/batch': {
      post: {
        tags: ['Config'],
        summary: 'Actualizar varias claves de configuración',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ConfigItem' },
              },
            },
          },
        },
        responses: {
          200: { description: 'Configuración actualizada' },
        },
      },
    },
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Subir imagen de producto',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'URL pública de la imagen',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { description: 'Archivo inválido' },
        },
      },
    },
    '/api/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Hablar con RotiAI',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Respuesta del asistente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    respuesta: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { description: 'Mensaje requerido' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
