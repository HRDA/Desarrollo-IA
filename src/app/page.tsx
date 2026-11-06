import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgePercent, Headphones, ShieldCheck, Truck } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { categories } from "@/lib/categories";
import { getProducts } from "@/services/product-service";

export default async function HomePage() {
  const [{ products: featured }, { products: deals }] = await Promise.all([
    getProducts({ limit: 4, sortBy: "rating", order: "desc" }),
    getProducts({ limit: 4, sortBy: "price", order: "asc" }),
  ]);

  return (
    <>
      <section className="hero">
        <Image
          src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=85"
          alt="Dispositivos tecnológicos sobre un escritorio moderno"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="hero-kicker"><span className="pulse-dot" /> Descubre lo que sigue</span>
          <h1>La tecnología<br />que mueve <em>tus ideas.</em></h1>
          <p>Productos que conectan con tu ritmo, elevan tu día y te llevan un paso más allá.</p>
          <Link className="button-light" href="/productos">
            Explorar productos <ArrowRight size={17} />
          </Link>
          <div className="hero-note">Selección inteligente · Envíos seguros · Compra sin complicaciones</div>
        </div>
        <div className="hero-index"><span>01</span> / 04</div>
      </section>

      <section className="container category-section" id="categorias">
        <div className="section-heading">
          <div><span className="eyebrow">Encuentra tu próxima idea</span><h2>Explora por categoría</h2></div>
          <Link href="/productos" className="text-link">Ver todo <ArrowUpRight size={16} /></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/productos?category=${category.id}`} className={`category-card category-tone-${index + 1}`}>
              <span className="category-number">0{index + 1}</span>
              <div><h3>{category.label}</h3><p>{category.description}</p></div>
              <ArrowUpRight size={19} className="category-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Elegidos para ti</span><h2>Favoritos de la comunidad</h2><p className="section-subtitle">Tecnología que vale la pena tener cerca.</p></div>
            <Link href="/productos" className="text-link">Ver catálogo <ArrowUpRight size={16} /></Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="container offer-section">
        <div className="offer-copy">
          <span className="offer-icon"><BadgePercent size={20} /></span>
          <span className="eyebrow">Oportunidades TechNova</span>
          <h2>Grandes ideas.<br /><em>Mejor precio.</em></h2>
          <p>Descubre productos con descuentos seleccionados y encuentra ese upgrade que estabas esperando.</p>
          <Link href="/productos" className="button-primary">Ver ofertas <ArrowRight size={17} /></Link>
        </div>
        <div className="offer-products"><ProductGrid products={deals} /></div>
      </section>

      <section className="promise-section">
        <div className="container promise-inner">
          <div><Truck size={21} /><span><strong>Envíos seguros</strong><small>Información clara para tu entrega</small></span></div>
          <div><ShieldCheck size={21} /><span><strong>Compra con confianza</strong><small>Detalles transparentes de cada producto</small></span></div>
          <div><Headphones size={21} /><span><strong>A tu ritmo</strong><small>Explora y compara sin presión</small></span></div>
        </div>
      </section>
    </>
  );
}
