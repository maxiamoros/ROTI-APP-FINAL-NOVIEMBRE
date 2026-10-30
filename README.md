# 🍗 Rotisería Central (RotiApp)

**"Sistema Integral de Gestión Gastronómica, Terminal de Punto de Venta (POS/KDS), Portal de Pedidos y Asistente Virtual Inteligente con LangChain & Gemini"**

Rotisería Central (**RotiApp**) es una plataforma web full-stack de última generación concebida para modernizar y optimizar la operativa integral de establecimientos gastronómicos y rotiserías tradicionales. El sistema unifica en un único ecosistema digital la atención al público (mediante portal de pedidos online y tótem autoservicio), la facturación en mostrador (POS), la comanda en cocina en tiempo real (KDS), el control analítico de inventario con deducción automática de stock por escandallo de recetas, y un asistente conversacional inteligente impulsado por Inteligencia Artificial generativa capaz de interactuar con el menú y los clientes de manera natural.

---

## 📋 Acerca del Proyecto

* **Institución Educativa:** IES 9-012 "Victoria Ocampo"
* **Carrera:** Tecnicatura Superior en Desarrollo de Software
* **Cátedra / Proyecto:** Práctica Profesionalizante / Proyecto Integrador Final
* **Autor / Desarrollador Principal:** Maximiliano Amorós (`maxiamoros`)
* **Email de Contacto:** `maxiamoros123@gmail.com`
* **Repositorio Oficial:** [github.com/maxiamoros/ROTI-APP-FINAL-NOVIEMBRE](https://github.com/maxiamoros/ROTI-APP-FINAL-NOVIEMBRE)
* **Fecha de Lanzamiento:** Noviembre 2026
* **Estado:** Producción / Versión 2.0 (Lanzamiento Final)

---

## 🎯 Objetivo General

Diseñar, implementar y desplegar una solución tecnológica integral y modular que digitalice el ciclo completo de venta y gestión gastronómica de una rotisería, reduciendo los tiempos de espera del cliente, automatizando el control de insumos y materia prima en tiempo real, erradicando los errores de comanda entre mostrador y cocina, y proporcionando un canal de atención automatizado con Inteligencia Artificial conectado al stock y catálogo del negocio.

---

## ✨ Funcionalidades Principales

### 🛒 Portal del Cliente y Autoservicio (Web & Tótem)
* 📱 **Catálogo Interactivo en Tiempo Real:** Visualización fluida de platos, bebidas y combos agrupados por categorías, con imágenes de alta calidad, precios actualizados y etiquetas informativas.
* 🛍️ **Carrito de Compras Dinámico:** Incorporación, modificación de cantidades y cálculo instantáneo de subtotales y totales.
* 🛵 **Modalidades de Entrega Flexibles:** Selección entre retiro por mostrador (*Take Away*) o envío a domicilio (*Delivery*) con ingreso de datos de entrega.
* 💳 **Múltiples Formas de Pago:** Soporte para efectivo, transferencias bancarias, Mercado Pago / QR y tarjetas de débito/crédito.
* 🎫 **Generador de Tickets y Seguimiento:** Emisión automática de comprobante de pedido con identificador numérico único para el seguimiento de la orden.
* 🖥️ **Modo Tótem Self-Service:** Interfaz optimizada para pantallas táctiles de gran formato, ideal para autoservicio dentro del local con navegación táctil accesible.

### 💼 Panel de Administración y Gerencia
* 📊 **Dashboard Analítico:** Gráficos y métricas clave de ingresos, volumen de pedidos diarios, productos más vendidos y tendencias semanales.
* 🍽️ **Gestor CRUD de Productos:** Alta, edición, baja lógica, fijación de precios, categorización y carga de imágenes (vía almacenamiento local o Supabase Storage).
* 🏷️ **Gestión de Categorías:** Configuración de secciones del menú con emojis distintivos y conmutador de visibilidad.
* 👥 **Administración de Personal y Roles:** Control de usuarios con niveles de acceso granulares: `ADMIN`, `GERENTE`, `COCINERO` y `CAJERO`.
* 🛡️ **Seguridad y Whitelist Google OAuth:** Lista blanca de correos electrónicos corporativos permitidos para acceder a áreas restringidas mediante inicio de sesión con Google.

### 💵 Módulo de Caja y Punto de Venta (POS)
* ⚡ **Facturación Ultrarrápida:** Interfaz táctil de botones grandes para el despacho acelerado en mostrador o llamadas telefónicas.
* 🪙 **Calculadora de Cambio:** Procesamiento de importes recibidos en efectivo con desglose exacto de vuelto.
* 🧾 **Cierre y Arqueo de Caja:** Registro cronológico de operaciones para auditoría y balance de turno.

### 👨‍🍳 Sistema de Pantalla de Cocina (KDS - Kitchen Display System)
* 📋 **Comandero Digital:** Recepción instantánea de las órdenes confirmadas tanto desde la web como desde el mostrador.
* ⏱️ **Semáforo de Tiempos:** Visualización priorizada de pedidos según tiempo transcurrido para evitar demoras.
* 🔔 **Gestión de Estados:** Transición de pedidos de `PENDIENTE` a `EN PREPARACION`, `LISTO` y `ENTREGADO`.

### 📦 Gestión de Inventario, Insumos y Escandallo
* 🥫 **Control de Stock de Materia Prima:** Monitoreo de insumos base (harina, queso muzzarella, carne, pollo, envases, etc.) con umbrales de stock mínimo.
* ⚠️ **Alertas de Desabastecimiento:** Notificaciones visuales automáticas cuando un insumo entra en estado crítico.
* ⚖️ **Escandallo de Recetas (RecetaItem):** Vinculación técnica de proporciones exactas de insumos por producto. Al confirmarse una venta, el motor descuenta en tiempo real los ingredientes correspondientes.

---

## 🧠 Módulo de Inteligencia Artificial

El sistema incorpora **RotiAI**, un agente de asistencia gastronómica impulsado por **Google Gemini API** (`gemini-3.5-flash`) orquestado mediante **LangChain** y un microservicio en Python:

1. **Contexto de Negocio Inyectado en Tiempo Real (RAG Dinámico):** El asistente consulta directamente la base de datos (SQLite / PostgreSQL) extrayendo el catálogo de productos disponibles, precios al día y niveles de stock de cocina antes de responder, garantizando que jamás ofrezca platos agotados o desactualizados.
2. **Memoria Conversacional Multi-Turno:** Mantiene el hilo y las preferencias del usuario a lo largo de toda la conversación utilizando buffers de memoria de LangChain (`MessagesPlaceholder`).
3. **Recomendaciones y Maridaje Personalizado:** Sugiere combinaciones culinarias, promociones del día, maridaje de bebidas y opciones para comensales según ocasión (almuerzos ejecutivos, cenas familiares, eventos).
4. **Asistencia Directa al Proceso de Compra:** Guía paso a paso al usuario para armar su pedido en el portal `/cliente` o lo redirecciona con un mensaje prearmado al canal de WhatsApp del negocio.
5. **Comunicación Empática y Localizada:** Diseñado con un *system prompt* especializado en tono argentino, cálido, profesional y enfocado en la conversión gastronómica.

---

## 🧰 Stack Tecnológico

| Tecnología | Uso |
| :--- | :--- |
| **React 19** | Biblioteca frontend reactiva para interfaces declarativas y componentes modulares |
| **Vite 8** | Entorno de desarrollo ultrarrápido y empaquetador frontend de última generación |
| **TailwindCSS 4** | Framework de utilidades CSS para diseño responsive, animaciones y glassmorphism |
| **Node.js 20+** | Entorno de ejecución en servidor para la arquitectura backend y API REST |
| **Express 5** | Servidor HTTP y enrutador modular para el consumo de microservicios y endpoints |
| **Prisma ORM 6** | Mapeador relacional de base de datos con tipado seguro y migraciones automáticas |
| **SQLite / PostgreSQL** | Motores de persistencia de datos (desarrollo local y Supabase en nube) |
| **Python 3.10+** | Runtime para ejecución de modelos de IA, agentes y pipelines de lenguaje natural |
| **LangChain 0.3+** | Framework para orquestación de prompts, herramientas de memoria y agentes conversacionales |
| **Google Gemini API** | Modelo de lenguaje fundacional (`gemini-3.5-flash`) para inferencia de alta velocidad |
| **JSON Web Tokens (JWT)** | Firma y validación criptográfica de tokens para autenticación sin estado |
| **Bcrypt.js** | Algoritmo de hashing robusto para el resguardo de contraseñas de usuarios |
| **Google Identity Services** | Autenticación federada (OAuth 2.0) con inicio de sesión seguro mediante cuenta de Google |
| **Multer / Supabase Storage** | Procesamiento y persistencia de archivos multimedia e imágenes de catálogo |
| **Lucide React** | Librería moderna de iconografía vectorial |
| **Concurrently** | Herramienta de orquestación para ejecutar backend y frontend simultáneamente en desarrollo |

---

## 👥 Actores y Roles del Sistema

* **Administrador / Gerente:** Acceso irrestricto al sistema. Puede gestionar personal, editar precios, configurar el tótem, revisar reportes financieros y auditar inventarios.
* **Cajero / Personal de Mostrador:** Opera la interfaz POS, cobra pedidos presenciales o telefónicos, abre/cierra caja y emite comprobantes.
* **Cocinero / Personal de Elaboración:** Interactúa con el monitor KDS en cocina, cambiando los estados de preparación de los pedidos según salen los platos.
* **Cliente Web / Tótem:** Usuario final que explora el menú, arma su carrito, consulta dudas a la IA y formaliza su pedido de forma autónoma.

### Otros Actores
* **RotiAI (Agente de Inteligencia Artificial):** Procesa consultas naturales, asiste al cliente 24/7 y verifica la disponibilidad de platos contra la base de datos.
* **Repartidor / Cadete:** Recibe la orden empaquetada con la comanda impresa/digital con los datos de entrega del cliente.

---

## 📋 Requerimientos Funcionales Principales

| Código | Requerimiento | Prioridad |
| :---: | :--- | :---: |
| **RF-01** | Permitir el registro e inicio de sesión de empleados con roles y contraseñas encriptadas con bcrypt | Alta |
| **RF-02** | Permitir inicio de sesión con Google OAuth filtrando únicamente correos en Whitelist autorizada | Alta |
| **RF-03** | Visualizar el menú público con filtros por categoría, búsqueda por texto e imágenes en alta resolución | Alta |
| **RF-04** | Administrar el carrito de compras con sumatoria automática y cálculo de costos de envío | Alta |
| **RF-05** | Registrar pedidos en base de datos con asignación de número de comanda correlativo | Alta |
| **RF-06** | Brindar un panel KDS para cocina con actualización de estados en tiempo real | Alta |
| **RF-07** | Permitir el alta, baja, modificación y conmutación de estado de productos y categorías | Alta |
| **RF-08** | Gestionar insumos con stock actual, stock crítico y descontar insumos por receta al vender | Alta |
| **RF-09** | Proporcionar una ventana de chat interactiva con IA alimentada por catálogo real y memoria conversacional | Alta |
| **RF-10** | Permitir la carga de imágenes de productos y guardarlas en almacenamiento local o bucket de Supabase | Media |
| **RF-11** | Emitir métricas de ventas históricas, ticket promedio y artículos con mayor demanda | Media |
| **RF-12** | Permitir la parametrización de pantalla de inicio y productos visibles en el Tótem Autoservicio | Media |

---

## ⚙️ Requerimientos No Funcionales

| Código | Requerimiento | Descripción |
| :---: | :--- | :--- |
| **RNF-01** | **Seguridad** | Cifrado unidireccional de contraseñas, validación estricta de JWT en cabeceras y control estricto de CORS. |
| **RNF-02** | **Rendimiento** | Respuestas de la API REST inferiores a 200ms en consultas estándar y carga inicial del cliente en menos de 1.5s. |
| **RNF-03** | **Disponibilidad** | Arquitectura desacoplada lista para despliegue en Vercel/Render y bases de datos con pooler de conexiones. |
| **RNF-04** | **Usabilidad** | Diseño *Mobile-First*, accesible e intuitivo, apto para pantallas táctiles de gran porte y dispositivos móviles. |
| **RNF-05** | **Integridad de Datos**| Relaciones foráneas con borrado seguro y transacciones atómicas para el descuento de stock de recetas. |
| **RNF-06** | **Tolerancia a Fallos**| En caso de corte de conexión con la IA externa, el portal de pedidos continuará operando normalmente. |
| **RNF-07** | **Modularidad** | Código organizado bajo el patrón Modelo-Ruta-Controlador-Servicio en backend y componentes funcionales en React. |
| **RNF-08** | **Mantenibilidad** | Esquemas centralizados con Prisma ORM que facilitan la migración entre SQLite y PostgreSQL sin refactorización. |

---

## 🚀 Instalación y Uso

### 🔧 Requisitos Previos

Antes de comenzar, asegúrate de contar con las siguientes herramientas instaladas en tu sistema operativo:

* **Node.js:** Versión 18.0.0 o superior
* **npm:** Versión 9.0.0 o superior
* **Python:** Versión 3.10 o superior (con `pip`)
* **Git:** Para clonar el repositorio

Verifica las versiones ejecutando:
```bash
node -v
npm -v
python --version
git --version
```

---

### 📥 Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/maxiamoros/ROTI-APP-FINAL-NOVIEMBRE.git
cd ROTI-APP-FINAL-NOVIEMBRE
```

#### 2. Instalar dependencias del proyecto raíz y del frontend
```bash
# Instalar dependencias del backend / raíz
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

#### 3. Instalar dependencias del módulo Python de Inteligencia Artificial
```bash
pip install -r backend/requirements.txt
```

#### 4. Configurar las variables de entorno
Crea tu archivo `.env` en la raíz tomando como base la plantilla [.env.example](.env.example):
```bash
cp .env.example .env
```
Edita [.env](.env) completando tus credenciales:
```env
# Base de datos (SQLite local por defecto)
DATABASE_URL="file:./dev.db"

# Autenticación JWT Backend
JWT_SECRET="rotiapp_clave_secreta_jwt_produccion_2026"

# Inteligencia Artificial Google Gemini
GEMINI_API_KEY="AIzaSyTuClaveDeGoogleGeminiAqui"
GEMINI_MODEL="gemini-3.5-flash"

# Google OAuth (opcional para Login con Google)
GOOGLE_CLIENT_ID="tu_google_client_id.apps.googleusercontent.com"

# Puerto local del servidor
PORT=3000
```

#### 5. Inicializar la Base de Datos con Prisma
Genera el cliente de Prisma y ejecuta la carga de datos iniciales (*seed*):
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

#### 6. Iniciar el entorno de desarrollo
Ejecuta concurrentemente el backend Express y el frontend Vite con un solo comando:
```bash
npm run dev
```

El sistema estará accesible en:
* 🌐 **Frontend Cliente & Admin:** `http://localhost:5173`
* 🔌 **Backend API REST:** `http://localhost:3000/api`

---

## 📦 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia en paralelo el servidor backend (Nodemon) y el servidor frontend (Vite) |
| `npm run dev:backend` | Inicia únicamente el servidor backend con recarga automática en puerto 3000 |
| `npm run dev:frontend` | Inicia únicamente el servidor de desarrollo de Vite en puerto 5173 |
| `npm run build` | Genera el cliente de Prisma y compila el bundle de producción del frontend |
| `npm run prisma:generate`| Regenera el cliente tipado de Prisma ORM a partir del archivo de esquema |
| `npm run prisma:db-push` | Sincroniza la estructura del modelo Prisma directamente con la base de datos |

---

## 🗂️ Estructura del Proyecto

```text
ROTI-APP-FINAL-NOVIEMBRE/
├── api/                             # Núcleo del Backend (Node.js & Express)
│   ├── controllers/                 # Controladores de lógica de negocio (Auth, Chat, Ventas, etc.)
│   ├── routes/                      # Definición de rutas REST y middlewares
│   ├── services/                    # Servicios de orquestación (comunicación con LangChain)
│   ├── prisma.js                    # Instancia singleton del cliente Prisma
│   └── index.js                     # Punto de entrada del servidor Express
├── backend/                         # Módulo de Inteligencia Artificial (Python)
│   ├── langchain_chat.py            # Agente conversacional RotiAI con LangChain + Gemini
│   ├── requirements.txt             # Dependencias Python (langchain, google-genai, etc.)
│   └── .env.example                 # Plantilla de variables de entorno para IA
├── frontend/                        # Aplicación de Usuario (React 19 + Vite 8 + Tailwind)
│   ├── public/                      # Recursos estáticos y subida de imágenes
│   └── src/
│       ├── components/              # Componentes UI reutilizables
│       │   ├── auth/                # Guardas de autenticación (ProtectedRoute)
│       │   ├── chat/                # Ventana flotante y header del chat RotiAI
│       │   └── layout/              # Barra de navegación, pie de página y wrappers
│       ├── context/                 # Contextos globales de React (AuthContext)
│       ├── pages/                   # Vistas principales del sistema
│       │   ├── AdminDashboard.jsx   # Tablero maestro de administración y reportes
│       │   ├── Caja.jsx             # Punto de venta (POS) y arqueo de mostrador
│       │   ├── CocinaKDS.jsx        # Pantalla de comanda para cocineros
│       │   ├── ConfigTotem.jsx      # Panel de configuración del modo Tótem
│       │   ├── LandingPage.jsx      # Página de inicio institucional con llamado a la acción
│       │   ├── Login.jsx            # Acceso de usuarios (credenciales y Google OAuth)
│       │   └── PortalCliente.jsx    # Catálogo interactivo y pasarela de pedidos cliente
│       ├── App.jsx                  # Enrutador principal de la aplicación (React Router)
│       └── main.jsx                 # Renderizado raíz de React en el DOM
├── prisma/                          # Modelado y persistencia de datos
│   ├── schema.prisma                # Esquema relacional de modelos (Usuario, Producto, Insumo, etc.)
│   └── seed.js                      # Script de inicialización con productos e insumos base
├── .env.example                     # Plantilla maestra de variables de entorno del sistema
├── .gitignore                       # Reglas de exclusión de Git (protección de credenciales)
├── package.json                     # Manifiesto de dependencias y scripts de ejecución
└── README.md                        # Documentación técnica integral del repositorio
```

---

## 📊 Casos de Uso Principales

### Caso de Uso Primario: Realización de Pedido con Asistencia de RotiAI

* **Actor:** Cliente Web / Comensal
* **Precondición:** El cliente ingresa al portal web (`/cliente`) o interactúa con el tótem del local.

#### Flujo Principal:
1. El usuario visualiza la variedad gastronómica organizada por categorías.
2. Si tiene dudas sobre ingredientes o promociones, abre el widget flotante de **RotiAI**.
3. RotiAI recupera en tiempo real los platos activos y el stock en cocina, recomendándole opciones personalizadas.
4. El cliente selecciona los productos deseados y los añade al carrito con un clic.
5. Abre el carrito, revisa los subtotales e indica si retirará en el local (*Take Away*) o solicita *Delivery*.
6. Selecciona el medio de pago (Efectivo, Mercado Pago / QR o Tarjeta) y confirma la compra.
7. El sistema registra el pedido en base de datos con estado `PENDIENTE` y emite un número de orden.
8. La orden aparece al instante en la pantalla de cocina (**CocinaKDS**).
9. El motor de recetas descuenta automáticamente la cantidad exacta de insumos correspondientes del inventario.
10. Cocina procesa el pedido cambiando el estado a `LISTO` para su posterior entrega.

---

## ❓ Problemas Comunes y Soluciones

### 1. Error: `No se encontró GEMINI_API_KEY configurada`
* **Causa:** No se ha definido la clave de API de Gemini en el archivo `.env`.
* **Solución:** Obtén una clave gratuita en [Google AI Studio](https://aistudio.google.com/) y asígnala a la variable `GEMINI_API_KEY` dentro de tu `.env` en la raíz.

### 2. Error al ejecutar el chat: `No se pudo ejecutar Python para LangChain`
* **Causa:** El ejecutable de Python no se encuentra en el PATH del sistema o su alias difiere.
* **Solución:** Asegúrate de que `python` o `python3` funcione en tu terminal. Puedes definir la variable `PYTHON_EXEC=python3` o la ruta absoluta a tu ejecutable en el `.env`. Además, corrobora haber ejecutado `pip install -r backend/requirements.txt`.

### 3. Error de base de datos o Prisma Client desactualizado
* **Causa:** Se modificó `schema.prisma` sin regenerar el cliente.
* **Solución:** Ejecuta `npx prisma generate` y seguidamente `npx prisma db push` para sincronizar las tablas.

### 4. Bloqueo al iniciar sesión con Google: `Correo no autorizado`
* **Causa:** La cuenta de Google no se encuentra en la Whitelist del sistema.
* **Solución:** Ingresa con el usuario administrador por defecto (`admin` / `admin123`) a `/admin` o `/config-totem` y añade tu correo a la lista de emails permitidos.

---

## 🎯 Alcance del Proyecto

### ✅ Dentro del Alcance
* Catálogo de productos y portal de autogestión de pedidos para clientes.
* Punto de venta rápido para cajeros con emisión de tickets digitales.
* Monitor de cocina interactivo (KDS) para optimizar los tiempos del personal gastronómico.
* Control de materias primas con escandallo automático de recetas al confirmar ventas.
* Asistente virtual con IA integrado a la base de datos de productos y stock.
* Autenticación dual (Credenciales con hash bcrypt y Google OAuth con Whitelist).
* Compatibilidad con modo pantalla táctil para tótems de autoservicio.

### 🔄 Fases Futuras / Fuera del Alcance
* Integración con pasarela de cobro bancario directa con Webhooks de Mercado Pago en tiempo real.
* Geolocalización GPS para seguimiento en vivo del repartidor de delivery en un mapa interactivo.
* Notificaciones push directas vía WhatsApp Business API automatizadas con Meta Graph API.
* Módulo de compras a proveedores con lectura automatizada de facturas mediante OCR.

---

## 🏗️ Arquitectura

El sistema implementa una **Arquitectura Cliente-Servidor Desacoplada y Orientada a Microservicios**:

```text
┌────────────────────────────────────────────────────────┐
│             CAPA DE PRESENTACIÓN (CLIENTE)             │
│    React 19 + TailwindCSS 4 (Portal / Admin / KDS)     │
└───────────────────────────┬────────────────────────────┘
                            │ Peticiones HTTP / REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│               CAPA DE SERVICIO (BACKEND)               │
│          Node.js + Express 5 (Controladores & JWT)     │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌───────────────────────────┐┌───────────────────────────┐
│     PERSISTENCIA ORM      ││    MICROSERVICIO DE IA    │
│  Prisma 6 (SQLite / PG)   ││   Python 3 + LangChain    │
│  Tablas, Recetas y Stock  ││    Google Gemini API      │
└───────────────────────────┘└───────────────────────────┘
```

* **Frontend:** Single Page Application (SPA) construida con React 19 y empaquetada con Vite 8, garantizando navegación instantánea sin recarga y diseño responsivo adaptado tanto a smartphones como a tótems de 32 pulgadas.
* **Backend:** Servidor Node.js con Express 5 diseñado bajo arquitectura en capas: Enrutadores (`routes`), Controladores (`controllers`), Servicios (`services`) y Middleware de seguridad.
* **Módulo de Inteligencia Artificial:** Servicio desacoplado en Python que utiliza LangChain para implementar arquitecturas de razonamiento conversacional enriquecidas con contexto relacional de la rotisería.
* **Persistencia:** Prisma ORM abstrae la base de datos relacional, permitiendo operar sin fricción en SQLite para entornos locales y migrar de forma transparente a PostgreSQL en Supabase para producción.

---

## 📅 Cronograma de Desarrollo

| Sprint / Fase | Actividad Principal | Responsable |
| :---: | :--- | :---: |
| **Sprint 1** | Levantamiento de requerimientos, diseño UI/UX y maquetación de componentes base | Maximiliano Amorós |
| **Sprint 2** | Modelado de datos en Prisma, autenticación JWT y endpoints REST de productos | Maximiliano Amorós |
| **Sprint 3** | Desarrollo del Módulo POS de Caja y Monitor de Cocina KDS | Maximiliano Amorós |
| **Sprint 4** | Lógica de Inventario, Insumos y Escandallo de Recetas con descuento automático | Maximiliano Amorós |
| **Sprint 5** | Integración del Agente RotiAI con Python, LangChain y Google Gemini API | Maximiliano Amorós |
| **Sprint 6** | Autenticación Google OAuth con Whitelist, testing integral, optimización y release final | Maximiliano Amorós |

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas y fundamentales para la mejora continua del proyecto. Para colaborar:

1. Realiza un **Fork** del repositorio.
2. Crea una rama temática para tu funcionalidad:
   ```bash
   git checkout -b feature/NuevaFuncionalidad
   ```
3. Realiza los cambios correspondientes y genera commits descriptivos:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad culinaria"
   ```
4. Envía tus cambios a tu repositorio remoto:
   ```bash
   git push origin feature/NuevaFuncionalidad
   ```
5. Abre un **Pull Request** formal describiendo detalladamente las mejoras implementadas.

---

## 📄 Documentación

* **API Endpoints:** Documentación interactiva de las rutas REST en `/api`.
* **Prisma Studio:** Para explorar visualmente los registros de la base de datos, ejecuta:
  ```bash
  npx prisma studio
  ```
* **Esquema de Datos:** Consulta el archivo relacional formal en [prisma/schema.prisma](prisma/schema.prisma).

---

## 📞 Soporte

Si encuentras algún problema o deseas realizar consultas técnicas:
* 📧 **Email:** `maxiamoros123@gmail.com`
* 🐙 **GitHub Issues:** [Abrir un Issue](https://github.com/maxiamoros/ROTI-APP-FINAL-NOVIEMBRE/issues)
* 📍 **Institución:** IES 9-012 "Victoria Ocampo"

---

## 📜 Licencia

Este proyecto se encuentra bajo los términos de la Licencia **MIT**. Consulta el archivo `LICENSE` para mayores precisiones sobre uso, copia y distribución académica o comercial.

---

<p align="center">
  <b>Desarrollado con ❤️ por Maximiliano Amorós</b><br>
  <i>Tecnicatura Superior en Desarrollo de Software — IES 9-012 "Victoria Ocampo"</i><br>
  Mendoza, Argentina • 2026
</p>
