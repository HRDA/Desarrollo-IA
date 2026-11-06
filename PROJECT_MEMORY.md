# Memoria del proyecto

**Proyecto:** TechNova Store  
**Actualizado:** 2026-11-03  
**Estado global:** Aplicación verificada con 18 pruebas unitarias, 6 E2E, lint, TypeScript, build y auditoría de dependencias. Pendiente URL confirmada para GitHub.

## Estado real del workspace

El workspace contiene la aplicación y documentación de este proyecto. No se debe volver a generar su configuración inicial ni asumir que el proyecto no contiene archivos.

### Configuración inicial ya creada e inspeccionada

- `package.json`: metadatos `technova-store`, scripts de Next.js, React, Tailwind, ESLint, TypeScript, `node:test` y Playwright.
- `tsconfig.json`: opciones TypeScript con `strict: true` y alias `@/*`.
- `next.config.ts`: orígenes remotos de imágenes y cabeceras HTTP de seguridad.
- `postcss.config.mjs`: plugin `@tailwindcss/postcss`.
- `eslint.config.mjs`: configuración flat de ESLint para Next.js.
- `.gitignore`: exclusiones para dependencias, build, variables locales y editor.
- `.env.example`: URL opcional de DummyJSON; no se requiere una API key.
- `package-lock.json`: bloqueo de dependencias generado por npm.

Estos archivos se inspeccionaron antes de continuar. La configuración fue ajustada y validada con lint, TypeScript y build. El workspace usa Node.js `v20.15.0` y npm `10.7.0`; npm advierte que `eslint-visitor-keys` declara Node `^20.19.0 || ^22.13.0 || >=24`, aunque lint, pruebas y build sí se ejecutaron correctamente en el entorno actual.

### Código existente e implementado

- `src/types/product.ts`: tipos `Product`, `ProductList`, `ProductQuery` y categorías.
- `src/lib/validations/product.ts`: esquemas Zod para productos y filtros.
- `src/lib/categories.ts` y `src/lib/format.ts`: categorías y formato USD centralizado.
- `src/services/product-service.ts`: acceso a DummyJSON, filtro de categorías tecnológicas, paginación local, ordenamiento, timeout y validación de respuesta.
- `src/components/layout/header.tsx` y `footer.tsx`.
- `src/components/products/product-card.tsx`, `product-grid.tsx` y `product-catalog.tsx`.
- `src/components/cart/cart-provider.tsx` y `add-to-cart-button.tsx`.
- `src/app/`: inicio, catálogo, detalle, carrito, estados de carga/error/404 y API propia.
- `src/lib/api-error.ts`: respuestas HTTP consistentes para errores de servicio.
- `src/components/products/product-purchase-panel.tsx` y `src/components/cart/cart-view.tsx`: selector y vista funcional del carrito.
- `src/app/globals.css`: estilos responsive mobile-first.
- Pruebas para formato, esquemas, servicio, Route Handlers y estado del carrito; 6 E2E Playwright en Chromium con proveedor local simulado.
- `README.md`: instalación, configuración, comandos, API, pruebas y limitaciones.

Los módulos están conectados a las rutas de Next.js; el build, las pruebas y los recorridos manuales confirman su funcionamiento básico.

## Funcionalidades completadas

- Inicio, catálogo con búsqueda/filtro/ordenamiento, detalle y carrito persistente.
- API propia de productos, validación de entradas/respuestas, estados de carga/error/vacío y formato USD.
- Responsive y medidas básicas de seguridad HTTP, imágenes remotas y validación de datos del carrito.
- Documentación AGENTS, SDD, decisiones, memoria, registro Vibe Coding y README.

### Pendientes de implementación

- No hay checkout, autenticación ni órdenes persistidas.
- No hay cobertura Playwright en Firefox/WebKit; las E2E verificadas corren en Chromium.
- No se ha inicializado Git ni desplegado/publicado la aplicación. Para crear el historial Git se requiere primero URL confirmada del repositorio GitHub.

## Problemas conocidos

- El catálogo depende de DummyJSON; si el servicio remoto falla se informa el error, no se presenta un fallback inventado.
- Una dependencia transitiva de ESLint recomienda Node 20.19+; Node 20.15 pasó los comandos comprobados, con advertencia de motor.
- No existe checkout, CSP configurada ni repositorio Git.
- `npm audit` no reportó vulnerabilidades conocidas en la auditoría realizada el 2026-11-03; volver a auditar antes de publicar futuras versiones.

## Avances y comprobaciones

- Se verificó manualmente que `https://dummyjson.com/products` responde y contiene las categorías `smartphones`, `laptops`, `tablets` y `mobile-accessories`; en la consulta realizada había 38 productos de esas categorías.
- Se comprobó una URL de imagen de Unsplash con respuesta HTTP 200; las imágenes de portada de la aplicación también se comprobaron en navegador.
- Se intentó usar `create-next-app` en la carpeta solicitada; el comando rechazó el nombre del directorio `appNext` por las reglas de nombres npm. No se creó otro proyecto. Se decidió preparar la configuración en el mismo workspace.
- El usuario señaló que la planificación/documentación debía preceder a más funcionalidades. Se detuvo el trabajo de rutas e interfaz para crear esta documentación y registrar el estado real.
- Se corrigió ESLint para el uso exclusivo de App Router y se adaptó la persistencia del carrito para evitar actualizaciones sincrónicas de estado en efectos.
- Se fijó Tailwind CSS en `4.1.17` y se fuerza Webpack para `dev`/`build`: la versión de Tailwind más reciente que npm resolvió usaba un paquete ESM incompatible con Turbopack en Node 20.15.
- Se añadió un override compatible de `minimatch` (`11.0.4`) tras la auditoría inicial; luego `npm audit` terminó con cero vulnerabilidades.
- Se descartó Vitest tras detectar avisos de vulnerabilidad en las versiones compatibles con Node instalado; las pruebas usan `node:test` y `tsx`.
- El build reveló que DummyJSON incluye categorías no comerciales; el esquema externo acepta categorías del proveedor y filtra solo las cuatro categorías objetivo.
- En el cierre inicial del 2026-11-02, `npm test`: seis pruebas pasaron.
- Se ampliaron las pruebas a 18 casos: Route Handlers con proveedor simulado; errores HTTP, timeout y red del servicio; y operaciones de agregar, actualizar, eliminar y resumir el carrito.
- Se extrajeron las operaciones puras del carrito a `src/components/cart/cart-state.ts`; el proveedor de React las reutiliza sin cambiar su interfaz.
- Tras los cambios, `npm test` (18 pruebas), `npm run lint`, `npm run typecheck` y `npm run build` terminaron correctamente.
- Se añadió Playwright `@playwright/test` 1.64.1 y seis escenarios E2E para Chromium con proveedor de fixtures local.
- Las E2E verifican navegación inicio/catálogo/detalle/carrito, carga de imagen, búsqueda/filtro/orden, cantidades y totales, persistencia al recargar, estado vacío, JSON malformado y estructura inválida en `localStorage`, errores API 400/502, producto no encontrado, navegación móvil, desbordamiento y errores de hidratación.
- El JSON malformado del carrito ahora se registra, se elimina del almacenamiento y presenta un aviso visible; el mismo comportamiento se comprobó para payload con esquema inválido.
- Se alinearon `next` y `eslint-config-next` a `16.4.5`, parche actual del registro npm al comprobarlo.
- Validación final: `npm test` (18 aprobadas), `npm run test:e2e` (6 aprobadas), `npm run lint`, `npx tsc --noEmit`, `npm run build` y `npm audit` (cero vulnerabilidades) pasaron.
- Se confirmó que `.env.example` existe y `.env.local` no; `.gitignore` excluye `.env*` excepto el ejemplo, dependencias, build y reportes E2E.
- `npm run lint`, `npm run typecheck` y `npm run build` terminaron correctamente. El build muestra `/` y `/carrito` estáticos; `/productos`, detalle y API dinámicos.
- Pruebas HTTP: `/`, `/productos`, `/productos/78`, `/carrito` responden 200; API lista/detalle 200; ID/categoría inválidos 400; producto inexistente 404.
- Pruebas de navegador: todas las imágenes de portada cargaron; menú móvil, filtro de laptops, búsqueda, estado vacío, añadir al carrito, subtotal y persistencia al recargar funcionaron. En viewport disponible de 300 px no hubo overflow horizontal.
- `npm audit` informó cero vulnerabilidades después del override y la sustitución de Vitest.
- El entorno informó que el directorio no es un repositorio Git.

## Decisiones vigentes

- App Router y Server Components por defecto; Client Components solo para interacciones locales (búsqueda, filtros y carrito).
- DummyJSON es el proveedor de catálogo inicial; la capa de servicio valida sus respuestas antes de exponerlas.
- La tienda limita su catálogo a las cuatro categorías tecnológicas acordadas.
- El carrito se persiste en `localStorage` con validación Zod; JSON ilegible o inválido se descarta con aviso. No se implementan pagos.
- Los Route Handlers exponen una API propia con paginación y filtros, además de errores controlados.
- Las pruebas E2E usan Playwright Chromium y un mock local para aislar DummyJSON; no publican ni reemplazan datos de producción.
- Los documentos de arquitectura distinguen lo propuesto de lo ya implementado.

## Última tarea realizada

Se cerró la validación de calidad: se agregaron y ejecutaron 6 pruebas E2E; pasaron también las 18 pruebas unitarias, lint, TypeScript, build y `npm audit`.

## Pendientes y limitaciones

- La demo no incluye pagos, autenticación ni órdenes persistidas.
- Las pruebas E2E cubren Chromium; no se han probado Firefox/WebKit ni configurado CI.
- Node 20.15.0 funcionó para las comprobaciones realizadas, pero una dependencia transitiva recomienda Node 20.19.0 o posterior.
- No hay repo Git ni URL remota: no se inicializó, no hay commits y no se hizo push. Se requiere URL GitHub confirmada para continuar.

## Próximo paso recomendado

Solicitar URL del repositorio GitHub y confirmarla antes de inicializar Git o publicar. Después, revisar el contenido a incluir y hacer push no forzado. Antes de despliegue, revalidar en Node 20.19+; el workspace no se ha desplegado.
