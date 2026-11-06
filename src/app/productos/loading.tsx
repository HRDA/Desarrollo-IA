export default function ProductsLoading() {
  return (
    <section className="container loading-state" role="status">
      <span className="loading-spinner" />
      <p>Cargando productos...</p>
      <div className="skeleton-grid" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <div className="product-skeleton" key={index} />)}
      </div>
    </section>
  );
}
