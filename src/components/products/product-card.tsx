import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { categories } from "@/lib/categories";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = categories.find(({ id }) => id === product.category)?.label ?? product.category;

  return (
    <article className="product-card">
      <Link href={`/productos/${product.id}`} className="product-image" aria-label={`Ver ${product.title}`}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          priority={priority}
        />
        {product.discountPercentage ? (
          <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
        ) : null}
      </Link>
      <div className="product-card-content">
        <span className="eyebrow product-category">{category}</span>
        <Link href={`/productos/${product.id}`} className="product-title">
          <h3>{product.title}</h3>
        </Link>
        <div className="product-rating">
          {product.rating ? <><Star size={14} fill="currentColor" /><span>{product.rating.toFixed(1)}</span></> : <span className="muted">Sin calificación</span>}
          <span className="stock-dot" /> <span className={product.stock > 0 ? "" : "muted"}>{product.stock > 0 ? "Disponible" : "Agotado"}</span>
        </div>
        <div className="product-card-bottom">
          <strong className="product-price">{formatPrice(product.price)}</strong>
          <div className="card-actions">
            <Link href={`/productos/${product.id}`} className="details-link" aria-label={`Ver detalles de ${product.title}`}>
              <ArrowUpRight size={17} />
            </Link>
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
