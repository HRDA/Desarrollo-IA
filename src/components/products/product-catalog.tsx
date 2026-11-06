"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { categories } from "@/lib/categories";
import type { Product, ProductCategory } from "@/types/product";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

export function ProductCatalog({
  products,
  initialQuery = "",
  initialCategory,
}: {
  products: Product[];
  initialQuery?: string;
  initialCategory?: ProductCategory;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory ?? "all");
  const [sort, setSort] = useState<SortOption>("popular");
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery = !term || `${product.title} ${product.description} ${product.brand ?? ""}`.toLocaleLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
    if (sort === "popular") result.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0));
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return result;
  }, [products, query, category, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setSort("popular");
  }

  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <div className="sidebar-heading"><SlidersHorizontal size={17} /><h2>Filtrar productos</h2></div>
        <label className="field-label" htmlFor="category-filter">Categoría</label>
        <div className="filter-options">
          <button className={category === "all" ? "filter-option active" : "filter-option"} onClick={() => setCategory("all")}>
            Todas <span>{products.length}</span>
          </button>
          {categories.map((item) => (
            <button key={item.id} className={category === item.id ? "filter-option active" : "filter-option"} onClick={() => setCategory(item.id)}>
              {item.label} <span>{products.filter((product) => product.category === item.id).length}</span>
            </button>
          ))}
        </div>
        <button className="clear-filters" onClick={clearFilters}><X size={15} /> Limpiar filtros</button>
      </aside>
      <section className="catalog-results" aria-label="Resultados del catálogo">
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o marca..." aria-label="Buscar productos del catálogo" />
          </label>
          <label className="sort-control">
            <span>Ordenar:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Ordenar productos">
              <option value="popular">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </label>
        </div>
        <p className="results-count">{filtered.length} {filtered.length === 1 ? "producto" : "productos"} encontrados</p>
        {filtered.length ? <ProductGrid products={filtered} /> : (
          <div className="empty-results">
            <span className="empty-icon"><Search size={24} /></span>
            <h2>No encontramos resultados</h2>
            <p>Prueba con otro término o limpia los filtros para ver todos los productos.</p>
            <button className="button-secondary" onClick={clearFilters}>Ver todos los productos</button>
          </div>
        )}
      </section>
    </div>
  );
}
