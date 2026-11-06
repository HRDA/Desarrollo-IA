# TechNova Store

Tienda demostrativa de productos tecnológicos en español, construida con Next.js App Router. El catálogo consume DummyJSON y presenta precios en USD. **No procesa pagos ni solicita información bancaria.**

## Tecnologías

- Next.js 16 y React 19
- TypeScript estricto
- Tailwind CSS 4
- Lucide React
- Zod
- DummyJSON
- Node `node:test` + `tsx` para pruebas unitarias
- Playwright para pruebas E2E en Chromium

## Funcionalidades

- Inicio con hero, categorías, productos destacados y sección de ofertas.
- Catálogo con búsqueda, filtros por categoría y ordenamiento.
- Detalle de producto con disponibilidad y selector de cantidad.
- Carrito interactivo con cantidades, eliminación, subtotal y persistencia local.
- API propia validada con Zod:
  - `GET /api/products`
  - `GET /api/products/[id]`
- Estados de carga, error y resultados vacíos.
- Interfaz adaptable a móvil, tablet y escritorio; imágenes optimizadas con `next/image`.

El inventario, el precio del proveedor y los totales locales son demostrativos. Los datos del carrito pueden ser modificados desde el navegador y no son una autoridad comercial.

## Requisitos

- Node.js 20.19 o superior recomendado.
- npm.

Node 20.15.0 también ejecutó las comprobaciones en este workspace, pero npm muestra una advertencia de motor para una dependencia de ESLint. Node 20.19+ evita esa advertencia.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

Para verificar el build de producción, ejecuta `npm run build` y después `npm start`.

## Variables de entorno

DummyJSON no necesita API key. La URL base opcional puede configurarse copiando `.env.example` a `.env.local`:

```env
DUMMYJSON_BASE_URL=https://dummyjson.com
```

No agregues secretos al repositorio.

## Comprobaciones

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` inicia un proveedor local simulado y el servidor Next.js de desarrollo. Las pruebas no dependen de la disponibilidad o cambios de DummyJSON; comprueban navegación, imágenes, búsqueda/filtros/orden, detalle, API, errores, persistencia y operaciones del carrito, datos locales inválidos, responsive e hidratación. Playwright requiere descargar Chromium una vez con el comando indicado.

El build y el servidor usan Webpack por compatibilidad con el runtime probado en este workspace. Las pruebas unitarias cubren formato USD, validaciones, servicio, Route Handlers y estado del carrito.

## API

`GET /api/products` acepta `q`, `category`, `limit` (1–50), `skip` (0–10000), `sortBy` (`price`, `rating`, `title`) y `order` (`asc`, `desc`).

```text
/api/products?category=laptops&sortBy=price&order=asc&limit=5
/api/products/78
```

Categorías admitidas: `smartphones`, `laptops`, `tablets` y `mobile-accessories`. Las respuestas de DummyJSON se validan antes de ser devueltas.

## Arquitectura y seguridad

- Las páginas de servidor cargan los productos; Client Components se reservan para búsqueda, filtros y carrito.
- La capa `src/services/` encapsula DummyJSON; `src/app/api/` contiene Route Handlers.
- Zod valida entradas, respuestas del proveedor y datos persistidos del carrito.
- Los datos JSON malformados o no válidos del carrito se descartan con un aviso visible.
- `next.config.ts` limita hosts de imágenes y configura cabeceras HTTP básicas.
- No se usa HTML remoto sin sanitizar ni se persiste información sensible.
- El precio y subtotal del carrito solo son informativos; no existe checkout.

Consulta [docs/SDD.md](./docs/SDD.md), [docs/DECISIONS.md](./docs/DECISIONS.md), [PROJECT_MEMORY.md](./PROJECT_MEMORY.md) y [AGENTS.md](./AGENTS.md) para diseño, decisiones y estado de implementación.

## Despliegue

El proyecto está preparado para una futura publicación en Vercel, pero no se ha desplegado ni publicado en GitHub. Antes de desplegar, ejecuta las comprobaciones, verifica las variables del entorno y confirma que el proveedor externo está disponible.
