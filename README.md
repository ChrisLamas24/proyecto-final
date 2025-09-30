# TechShop - Proyecto Final (Frontend)

Repositorio con la web de TechShop (HTML/CSS/JS + Bootstrap), consumiendo la Fake Store API.

## Requisitos ejecutados
- Landing (banner, categorías, testimonios, formulario contacto).
- Página Nosotros (historia, misión, fotos de tienda).
- Catálogo de productos (filtrado por categoría usando https://fakestoreapi.com).
- Diseño responsive, SEO básico y links a redes ficticias.

## Cómo ejecutar localmente (Visual Studio Code recomendado)
1. Clona o descarga este repositorio.
2. Abre la carpeta en Visual Studio Code.
3. Instala la extensión "Live Server" (opcional) y haz click en "Go Live" para servir los archivos.
4. Alternativamente, abre `index.html` en tu navegador (pero Live Server evita CORS en entorno local).
5. Revisa `products.html` y `product.html?id=1`.

## Endpoints utilizados de la Fake Store API
- Obtener todos los productos: `https://fakestoreapi.com/products`
- Obtener producto por ID: `https://fakestoreapi.com/products/{id}`
- Obtener categorías: `https://fakestoreapi.com/products/categories`
(Información proveída en el PDF del proyecto). :contentReference[oaicite:1]{index=1}

## Despliegue
- **GitHub Pages**: Crear repo -> push a `main` -> Settings > Pages -> Branch `main` / folder `/` -> Guardar.
- **Netlify**: Conectar repo desde Netlify y hacer deploy automático (recomendado para demo).

## Contact form
Actualmente simulado (ver `js/main.js`). Para recepción real:
- Crear cuenta en Formspree o Netlify Forms y reemplazar la URL en el formulario/index.js.
