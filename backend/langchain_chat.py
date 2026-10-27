import sys
import os
import json
import sqlite3
from pathlib import Path
from dotenv import load_dotenv

# Forzar codificación UTF-8 en Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Cargar variables de entorno desde backend/.env y .env raíz
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent

load_dotenv(current_dir / ".env")
load_dotenv(root_dir / ".env")

def get_db_connection():
    db_paths = [
        root_dir / "prisma" / "dev.db",
        current_dir / "prisma" / "dev.db",
        root_dir / "dev.db"
    ]
    for p in db_paths:
        if p.exists():
            return sqlite3.connect(str(p))
    return None

def fetch_store_context():
    """Obtiene datos actualizados de productos, categorías e inventario desde la base de datos."""
    conn = get_db_connection()
    productos_texto = ""
    insumos_texto = ""

    if conn:
        try:
            cursor = conn.cursor()
            # Productos activos agrupados
            cursor.execute("""
                SELECT p.nombre, p.precio, c.nombre as categoria
                FROM Producto p
                LEFT JOIN Categoria c ON p.categoriaId = c.id
                WHERE p.activo = 1
                ORDER BY c.nombre, p.nombre
            """)
            rows = cursor.fetchall()
            
            categorias = {}
            for nombre, precio, cat in rows:
                cat_name = cat or "Variedades"
                if cat_name not in categorias:
                    categorias[cat_name] = []
                categorias[cat_name].append(f"{nombre} - ${int(precio):,}".replace(",", "."))
            
            cat_list = []
            for cat, items in categorias.items():
                cat_list.append(f"**{cat}**:\n  - " + "\n  - ".join(items))
            productos_texto = "\n\n".join(cat_list)

            # Insumos y stock
            cursor.execute("SELECT nombre, stock, stockMinimo FROM Insumo")
            insumo_rows = cursor.fetchall()
            if insumo_rows:
                insumos_texto = "\n".join([f"- {n}: {s} en stock (mínimo: {sm})" for n, s, sm in insumo_rows])
            
            conn.close()
        except Exception as e:
            productos_texto = f"Error cargando menú desde BD: {e}"
    else:
        productos_texto = "Menú general: Milanesas napolitanas, Pizzas artesanales, Pollos al espiedo, Empanadas, Lomitos, Bebidas y Postres."

    # Contexto general de la web y el negocio
    web_context = f"""
[INFORMACIÓN GENERAL DE LA ROTISERÍA Y LA WEB]
- Nombre del local: La Rotisería Anti / Rotisería Central ("RotiApp")
- Especialidades culinarias:
  * Milanesas gigantes (ternera o pollo, solas o a la napolitana con salsa fileto, jamón y muzzarella gratinada).
  * Pizzas artesanales al horno (masa crocante, abundante queso muzzarella).
  * Pollos al espiedo dorados, jugosos y marinados con hierbas tradicionales.
  * Empanadas criollas y cortadas a cuchillo (carne suave, carne picante, jamón y queso, verdura).
  * Lomitos completos y hamburguesas caseras.
  * Pastas caseras y tartas individuales.
  * Postres caseros: Flan casero mixto (con dulce de leche y crema), Tiramisú, Budín de pan, Chocotorta.
  * Bebidas frías: Gaseosas (línea Coca-Cola), cervezas (Quilmes, Brahma, Stella), aguas con y sin gas.

- Servicios de la Web y Local:
  * Retiro por local: Preparación inmediata para retirar caliente en el mostrador.
  * Delivery a domicilio: Envíos en la zona (demora estimada 30 a 45 minutos).
  * Pedido online en la web: Los clientes pueden armar su carrito y hacer pedidos directamente desde la sección '/cliente'.
  * Tótem Self-Service: Pantalla táctil en el local para ordenar sin hacer filas.
  * Contacto por WhatsApp: Botón flotante en la web con enlace directo a +54 9 11 0000-0000.

- Ubicación y Horarios de Atención:
  * Dirección: Av. Principal 1234, Buenos Aires.
  * Horarios: Lunes a Viernes de 10:00 a 22:00 hs. Sábados y Domingos de 11:00 a 23:00 hs.
  * Medios de pago: Efectivo, Mercado Pago / QR, Tarjetas de débito y crédito.

[CATÁLOGO DE PRODUCTOS EN TIEMPO REAL (MENÚ Y PRECIOS)]
{productos_texto}

[ESTADO DE INVENTARIO E INSUMOS]
{insumos_texto if insumos_texto else "Todos los insumos se encuentran en niveles normales."}
"""
    return web_context

def run_chat_with_langchain(user_message, history=None):
    """Ejecuta la consulta usando LangChain y Gemini API con el contexto de la rotisería."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    web_context = fetch_store_context()

    system_prompt = f"""Eres "RotiAI", el asistente virtual inteligente y conversacional de La Rotisería Anti / RotiApp.

Tu misión es interactuar con los usuarios de forma empática, ágil, humana y servicial, respondiendo sus consultas y ayudándoles con todo lo relacionado con la rotisería, el menú, precios, pedidos, delivery y servicios de la web.

NORMAS DE INTERACCIÓN:
1. Responde de forma cordial, amable y coloquial (español argentino natural y cálido).
2. Tienes acceso completo al contexto del negocio, los productos activos, precios reales y servicios de la web.
3. Si el usuario pregunta qué pedir, recomiéndale especialidades de la casa (como la milanesa napolitana o empanadas) o postres caseros como el flan con dulce de leche.
4. Si el usuario quiere hacer un pedido online, indícale que puede armar su carrito en el portal de clientes haciendo clic en "Pedir Ahora" o "Delivery" (/cliente), o coordinar por WhatsApp.
5. Si te hacen una pregunta casual o general (saludos, clima, charla), responde con simpatía y buena onda, relacionándolo sutilmente con la comida cuando sea pertinente.
6. Presenta los precios de forma clara utilizando el formato argentino ($X.XXX).

{web_context}
"""

    if not api_key:
        return {
            "success": False,
            "error": "No se encontró GEMINI_API_KEY configurada.",
            "respuesta": "¡Hola! Por favor configura tu GEMINI_API_KEY en el archivo .env para habilitar las respuestas con IA conectada a Gemini."
        }

    try:
        # Importación de librerías LangChain
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
        from langchain_core.output_parsers import StrOutputParser

        # Instanciar el modelo LLM con LangChain
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=0.7,
            max_output_tokens=1000
        )

        # Construir historial de mensajes para LangChain
        formatted_messages = [SystemMessage(content=system_prompt)]
        
        if history and isinstance(history, list):
            for h in history[-8:]:  # Últimos mensajes para mantener contexto conversacional
                role = h.get("role", "")
                content = h.get("content", "")
                if role == "user":
                    formatted_messages.append(HumanMessage(content=content))
                elif role == "assistant":
                    formatted_messages.append(AIMessage(content=content))

        formatted_messages.append(HumanMessage(content=user_message))

        # Invocación directa mediante LangChain
        response = llm.invoke(formatted_messages)
        content = response.content if hasattr(response, "content") else str(response)

        return {
            "success": True,
            "backend": "LangChain + Gemini API",
            "model": model_name,
            "respuesta": content
        }

    except Exception as e:
        error_str = str(e)
        sys.stderr.write(f"[LangChain Error]: {error_str}\n")
        
        # Respuesta inteligente de contingencia basada en el contexto si hay problema de auth/cuota
        fallback_reply = generate_smart_fallback(user_message, web_context, error_str)
        return {
            "success": True,
            "fallback": True,
            "warning": error_str,
            "respuesta": fallback_reply
        }

def generate_smart_fallback(user_msg, context, error_info):
    """Genera una respuesta utilizando la base de datos y el contexto si la API de Gemini falla temporalmente."""
    query = user_msg.lower()
    
    if any(k in query for k in ["hola", "buenas", "que tal", "cómo estás", "como estas"]):
        return "¡Hola! Bienvenido a La Rotisería Anti. ¿Qué se te antoja comer hoy? Tenemos milanesas napolitanas, pizzas al horno, empanadas, lomitos y postres caseros."
    
    if any(k in query for k in ["menu", "menú", "carta", "platos", "precio", "precios", "que tienen", "qué tienen"]):
        return ("En nuestro menú contamos con grandes opciones:\n"
                "- **Milanesas Napolitanas**: Clásica de carne o pollo con papas fritas.\n"
                "- **Pizzas Artesanales**: Gran Muzzarella, Especiales y Fugazzeta.\n"
                "- **Pollos al espiedo**: Dorados y jugosos con papas.\n"
                "- **Empanadas Criollas**: Carne a cuchillo, pollo, jamón y queso.\n"
                "- **Lomitos y Hamburguesas**: Completos con papas.\n"
                "- **Postres**: Flan casero mixto, Tiramisú y Chocotorta.\n\n"
                "Puedes ver la lista completa con precios y armar tu carrito directamente en la sección **Delivery / Pedir Ahora** (/cliente).")

    if any(k in query for k in ["empanada", "empanadas"]):
        return "Tenemos empanadas caseras de carne cortada a cuchillo, jamón y queso, y pollo. ¡Salen súper calientes y jugosas! Podés pedir por unidad o por docena para retirar o con delivery."

    if any(k in query for k in ["milanesa", "milanesas"]):
        return "Nuestra Milanesa a la Napolitana con papas fritas es el plato estrella de la casa. Viene con salsa fileto casera, jamón cocido seleccionado y abundante mozzarella gratinada."

    if any(k in query for k in ["horario", "horarios", "abierto", "abren", "cierran", "donde estan", "dónde están", "direccion", "dirección"]):
        return "Estamos en **Av. Principal 1234, Buenos Aires**. Atendemos de **Lunes a Viernes de 10:00 a 22:00 hs** y **Sábados y Domingos de 11:00 a 23:00 hs**."

    if any(k in query for k in ["delivery", "envio", "envío", "pedir", "demora"]):
        return "Hacemos envíos a domicilio en toda la zona. La demora habitual es de 30 a 45 minutos. También puedes pedir para retirar por el local o enviar un mensaje a nuestro WhatsApp."

    return (f"¡Hola! Soy RotiAI de La Rotisería Anti. Puedo ayudarte con precios, especialidades del menú (milanesas, pizzas, empanadas), estado del delivery o nuestros horarios. ¿En qué te puedo dar una mano hoy?")

def main():
    """Manejo de entrada CLI o STDIN (JSON) para integración con Node.js / Express."""
    user_input = ""
    history = []

    # Verificar si se pasa por argumentos CLI
    if len(sys.argv) > 1:
        user_input = " ".join(sys.argv[1:])
    else:
        # Leer desde STDIN (JSON enviado por Node.js)
        try:
            stdin_data = sys.stdin.read()
            if stdin_data:
                parsed = json.loads(stdin_data)
                user_input = parsed.get("mensaje", "")
                history = parsed.get("historial", [])
        except Exception:
            user_input = stdin_data.strip()

    if not user_input:
        print(json.dumps({"error": "No se recibió mensaje para el chat."}))
        sys.exit(1)

    result = run_chat_with_langchain(user_input, history)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
