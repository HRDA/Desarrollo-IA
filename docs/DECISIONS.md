# Registro de decisiones arquitectónicas

Este registro conserva decisiones explícitas y su estado. Las propuestas pendientes no deben confundirse con funcionalidades verificadas.

## ADR-001 — Next.js App Router y renderizado de servidor

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** La aplicación debe usar Next.js 16+, presentar datos de productos y limitar lógica de cliente a interacciones.
- **Decisión:** Usar App Router y Server Components por defecto; reservar Client Components para búsqueda/filtros interactivos y carrito/localStorage.
- **Consecuencias:** El proveedor externo se consulta en servidor; los componentes de cliente reciben datos serializables. Las cuatro páginas principales siguen este límite.

## ADR-002 — DummyJSON detrás de un servicio propio

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** Se requiere una fuente inicial pública y una separación entre interfaz y proveedor.
- **Decisión:** Encapsular DummyJSON en `src/services/product-service.ts`, validar su respuesta con Zod y exponer operaciones mediante Route Handlers y carga del servidor.
- **Consecuencias:** Sin API key. Timeout de 8 segundos y revalidación de servidor de 300 segundos configurados inicialmente. El catálogo se limita a smartphones, laptops, tablets y mobile-accessories.

## ADR-003 — Contrato de producto acotado al catálogo

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** El proveedor expone muchas categorías y propiedades que no se necesitan.
- **Decisión:** Modelar únicamente los campos necesarios de `Product` y aceptar solo las cuatro categorías acordadas.
- **Consecuencias:** Cualquier cambio de payload se detecta en validación. Categorías nuevas no aparecen automáticamente hasta que se actualicen esquema y UI.

## ADR-004 — Carrito local demostrativo sin checkout

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** Se necesita demostrar persistencia y operaciones de carrito sin cobros reales.
- **Decisión:** Mantener artículos en contexto de cliente y persistir datos no sensibles en `localStorage`, validándolos con Zod.
- **Consecuencias:** El contenido puede ser alterado por el usuario y no es una autoridad para inventario o precios. No hay orden ni transacción persistida.

## ADR-005 — Validar antes de confiar y limitar el perímetro remoto

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** El proveedor externo y el navegador no son fuentes confiables.
- **Decisión:** Validar entradas/salidas con Zod, limitar cantidades y orígenes de imágenes, añadir cabeceras HTTP y evitar HTML no confiable.
- **Consecuencias:** Las cabeceras básicas, `remotePatterns` y errores HTTP están implementados. CSP y pruebas de seguridad específicas siguen pendientes de evaluación.

## ADR-006 — Documentar primero después de corrección de flujo

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** La configuración inicial y algunos módulos parciales se crearon antes de terminar el análisis y el SDD.
- **Decisión:** Conservar e inspeccionar el trabajo existente; detener temporalmente las nuevas funcionalidades para documentar el estado real, la arquitectura objetivo y el historial antes de retomar el desarrollo por fases.
- **Consecuencias:** La memoria separa los artefactos parciales de las funciones terminadas y verificadas; no se regenera la configuración existente.

## ADR-007 — Fijar Tailwind y utilizar Webpack en el entorno actual

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** El entorno tiene Node 20.15.0. Tailwind 4.3.4 falló al procesar CSS en Turbopack por interoperabilidad CommonJS/ESM. Tailwind 4.1.17 compiló correctamente con Webpack.
- **Decisión:** Fijar `tailwindcss` y `@tailwindcss/postcss` en 4.1.17 y ejecutar Next con `--webpack` en scripts `dev` y `build`. Definir `turbopack.root` explícitamente para que Next no infiera como raíz un lockfile externo al workspace.
- **Consecuencias:** Build verificado en el runtime disponible; la actualización del toolchain puede revisarse al usar Node 20.19+.

## ADR-008 — Runner integrado de Node para pruebas TypeScript

- **Fecha:** 2026-11-02
- **Estado:** Aceptada
- **Contexto:** Se deseaba añadir pruebas automáticas sin instalar un framework innecesario. La versión de Vitest evaluada generó hallazgos de auditoría, mientras el entorno ya dispone de `node:test`.
- **Decisión:** Ejecutar pruebas TypeScript con `tsx --test` y el runner integrado `node:test`.
- **Consecuencias:** Menos dependencias y auditoría limpia; las pruebas cubren validaciones/servicio/formato, pero la UI y E2E siguen siendo pruebas manuales.

## ADR-009 — Playwright con proveedor local aislado para E2E

- **Fecha:** 2026-11-03
- **Estado:** Aceptada
- **Contexto:** La validación final requiere comprobar flujos reales de navegador sin depender de disponibilidad, datos cambiantes o errores del proveedor público.
- **Decisión:** Añadir `@playwright/test` como dependencia de desarrollo y ejecutar E2E en Chromium contra un servidor local de fixtures que implementa el contrato mínimo de DummyJSON. El proveedor de prueba puede simular un 503 y usa un puerto/base path aislados por ejecución.
- **Consecuencias:** Las pruebas son repetibles y no cambian el servicio/productor de datos de la aplicación. Se requiere instalar Chromium una vez; otros navegadores no están cubiertos.

## ADR-010 — Descartar estado de carrito ilegible o inválido

- **Fecha:** 2026-11-03
- **Estado:** Aceptada
- **Contexto:** JSON corrupto en `localStorage` causaba avisos repetidos y persistía aunque la aplicación ya no pudiera recuperarlo.
- **Decisión:** Validar con Zod; ante JSON malformado o estructura inválida, retirar la clave guardada e informar que el carrito se reinició. Si el almacenamiento impide limpiarlo, mostrar un aviso distinto y registrar el error.
- **Consecuencias:** El carrito recupera un estado vacío seguro en lugar de fallar; los artículos guardados siguen siendo datos no confiables y no contienen información sensible.
