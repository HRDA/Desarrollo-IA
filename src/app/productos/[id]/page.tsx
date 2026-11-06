import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, PackageCheck, Star } from "lucide-react";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { categories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { ProductServiceError, getProductById } from "@/services/product-service";
import { notFound } from "next/navigation";
import { z } from "zod";

const idSchema = z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().int().positive());

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { title: "Producto no encontrado" };
  try {
    const product = await getProductById(parsed.data);
    return { title: product.title, description: product.description };
  } catch (error) {
    if (error instanceof ProductServiceError && error.status === 404) {
      return { title: "Producto no encontrado" };
    }
    throw error;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) notFound();

  let product;
  try {
    product = await getProductById(parsed.data);
  } catch (error) {
    if (error instanceof ProductServiceError && error.status === 404) notFound();
    throw error;
  }

  const category = categories.find(({ id: categoryId }) => categoryId === product.category)?.label ?? product.category;

  return (
    <section className="container detail-section">
      <Link href="/productos" className="back-link"><ArrowLeft size={17} /> Volver a productos</Link>
      <div className="product-detail">
        <div className="detail-image">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
          />
          {product.discountPercentage ? <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span> : null}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{category}{product.brand ? ` · ${product.brand}` : ""}</span>
          <h1>{product.title}</h1>
          <div className="detail-rating">
            {product.rating ? <><Star size={16} fill="currentColor" /><strong>{product.rating.toFixed(1)}</strong><span>de 5</span></> : <span>Sin calificación</span>}
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)} <small>USD</small></div>
          <div className={`availability ${product.stock > 0 ? "available" : "unavailable"}`}>
            <span className="availability-dot" />{product.stock > 0 ? `${product.availabilityStatus ?? "Disponible"} · ${product.stock} en inventario` : "Agotado"}
          </div>
          <ProductPurchasePanel product={product} />
          <div className="detail-divider" />
          <div className="detail-perks">
            <p><PackageCheck size={17} /><span>{product.shippingInformation ?? "Envío con seguimiento"}</span></p>
            <p><Check size={17} /><span>{product.warrantyInformation ?? "Detalles de garantía según fabricante"}</span></p>
          </div>
          <p className="demo-notice">Precios informativos en USD. Esta tienda demostrativa no procesa pagos.</p>
        </div>
      </div>
    </section>
  );
}
