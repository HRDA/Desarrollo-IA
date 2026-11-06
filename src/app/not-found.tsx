import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container error-state">
      <span className="eyebrow">404 · Página no encontrada</span>
      <h1>Este producto no está disponible</h1>
      <p>Puede que haya cambiado de lugar. Explora el catálogo para encontrar algo que te guste.</p>
      <Link className="button-primary" href="/productos">Explorar productos</Link>
    </section>
  );
}
