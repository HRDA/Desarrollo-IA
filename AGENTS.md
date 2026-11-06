# Instrucciones del agente

## Contexto y objetivo

Este repositorio desarrolla **TechNova Store**, una tienda tecnológica demostrativa en español, con precios en USD, usando Next.js App Router, React, TypeScript estricto y Tailwind CSS.

## Lectura obligatoria antes de modificar

Al comenzar cada sesión, lee primero:

1. `PROJECT_MEMORY.md`
2. `docs/SDD.md`
3. `docs/DECISIONS.md`

Consulta también `VIBE_CODING.md` para entender el historial reciente. Esos documentos describen el estado y las decisiones; comprueba el código antes de afirmar que algo está implementado.

## Reglas de trabajo

- Trabaja dentro de este proyecto y conserva los archivos existentes cuando sean correctos.
- Inspecciona el código y las configuraciones antes de editarlos. Evita regenerar configuraciones o duplicar capacidades ya presentes.
- Mantén separados los Server Components (predeterminados), los Client Components interactivos, la presentación y el acceso a datos.
- No accedas a DummyJSON directamente desde componentes. Usa `src/services/` o los Route Handlers propios.
- Valida las entradas y las respuestas externas con Zod; tipa los contratos y evita `any`.
- Mantén todo el contenido de interfaz en español y formatea precios mediante `Intl.NumberFormat` centralizado.
- No guardes datos sensibles en el navegador. Los importes calculados en el cliente son informativos, no una fuente confiable para operaciones comerciales.
- Usa `next/image` para imágenes remotas y limita sus orígenes mediante `remotePatterns`.
- Expón errores con mensajes apropiados al usuario y sin filtrar detalles internos; registra errores inesperados.
- Haz cambios pequeños y relacionados, actualiza la documentación asociada y valida con los comandos existentes.
- No declares una ruta o función terminada hasta comprobarla. No hagas despliegues ni operaciones destructivas de Git sin autorización.

## Arquitectura y convenciones

- Rutas App Router y Route Handlers en `src/app/`.
- Componentes reutilizables en `src/components/`, integraciones externas en `src/services/`, esquemas en `src/lib/validations/`, utilidades en `src/lib/` y contratos en `src/types/`.
- Usa nombres descriptivos en kebab-case para archivos y componentes React en PascalCase.
- Mantén límites explícitos: proveedor de datos externo, servicio de dominio y capa HTTP no son responsabilidades de los componentes visuales.
- Conserva las cabeceras de seguridad y los orígenes de imágenes remotas declarados en `next.config.ts`, revisándolos si cambia la necesidad del producto.
- Registra decisiones arquitectónicas nuevas en `docs/DECISIONS.md`.

## Comandos

- `npm run dev`: servidor local.
- `npm run lint`: ESLint.
- `npm run typecheck`: comprobación TypeScript.
- `npm test`: pruebas unitarias.
- `npm run build`: build de producción.

Al finalizar una sesión de implementación, actualiza `PROJECT_MEMORY.md` y `VIBE_CODING.md`; ajusta `docs/SDD.md` si la arquitectura o los contratos cambiaron.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
