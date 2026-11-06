import Link from "next/link";
import { ArrowUpRight, Mail, ShieldCheck, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-benefits">
        <div><Truck size={20} /><span><strong>Envíos seguros</strong><small>Con seguimiento de tu pedido</small></span></div>
        <div><ShieldCheck size={20} /><span><strong>Compra con confianza</strong><small>Información clara y protegida</small></span></div>
        <div><Mail size={20} /><span><strong>Estamos para ayudarte</strong><small>Atención cercana y oportuna</small></span></div>
      </div>
      <div className="footer-main">
        <div className="container footer-columns">
          <div className="footer-about">
            <Link href="/" className="brand footer-brand">
              <span className="brand-mark"><span /></span>
              <span>TechNova<span className="brand-light"> Store</span></span>
            </Link>
            <p>Tecnología seleccionada para acompañar tus ideas, tu trabajo y cada momento.</p>
          </div>
          <div>
            <h3>Explora</h3>
            <Link href="/productos">Todos los productos</Link>
            <Link href="/productos?category=smartphones">Smartphones</Link>
            <Link href="/productos?category=laptops">Laptops</Link>
            <Link href="/productos?category=tablets">Tablets</Link>
          </div>
          <div>
            <h3>Tu compra</h3>
            <Link href="/carrito">Tu carrito <ArrowUpRight size={14} /></Link>
            <p className="footer-note">Los productos y precios se muestran en USD. Esta demostración no procesa pagos.</p>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} TechNova Store. Proyecto demostrativo.</span>
        <span>Diseñado para disfrutar la tecnología.</span>
      </div>
    </footer>
  );
}
