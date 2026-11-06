"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Error al renderizar la página.", error);
  }, [error]);

  return (
    <section className="container error-state">
      <span className="eyebrow">Algo no salió como esperábamos</span>
      <h1>No pudimos cargar esta página</h1>
      <p>Revisa tu conexión e inténtalo de nuevo. Tus artículos guardados no se han eliminado.</p>
      <div className="error-actions">
        <button className="button-primary" onClick={reset}>Intentar de nuevo</button>
        <Link className="button-secondary" href="/">Volver al inicio</Link>
      </div>
    </section>
  );
}
