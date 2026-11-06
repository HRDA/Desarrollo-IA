"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, isReady, storageWarning, updateQuantity, removeFromCart } = useCart();

  if (!isReady) {
    return <div className="cart-loading" role="status"><span className="loading-spinner" /><p>Cargando tu carrito...</p></div>;
  }

  if (!items.length) {
    return (
      <div className="cart-empty">
        <span className="empty-icon"><ShoppingBag size={26} /></span>
        <h2>Tu carrito está esperando algo especial</h2>
        <p>Explora el catálogo y guarda aquí los productos que te interesan.</p>
        <Link href="/productos" className="button-primary">Explorar productos <ArrowRight size={17} /></Link>
        {storageWarning && <p className="storage-warning" role="status">{storageWarning}</p>}
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {items.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <Link href={`/productos/${product.id}`} className="cart-line-image">
              <Image src={product.thumbnail} alt={product.title} fill sizes="112px" />
            </Link>
            <div className="cart-line-info">
              <span className="eyebrow">{product.brand ?? product.category}</span>
              <Link href={`/productos/${product.id}`}><h2>{product.title}</h2></Link>
              <strong>{formatPrice(product.price)}</strong>
              <div className="quantity-picker cart-quantity">
                <div>
                  <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1} aria-label={`Reducir cantidad de ${product.title}`}><Minus size={14} /></button>
                  <output>{quantity}</output>
                  <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= 99} aria-label={`Aumentar cantidad de ${product.title}`}><Plus size={14} /></button>
                </div>
                <button className="remove-button" type="button" onClick={() => removeFromCart(product.id)} aria-label={`Eliminar ${product.title}`}><Trash2 size={15} /><span>Eliminar</span></button>
              </div>
            </div>
            <strong className="cart-line-total">{formatPrice(product.price * quantity)}</strong>
          </article>
        ))}
        {storageWarning && <p className="storage-warning" role="status">{storageWarning}</p>}
      </div>
      <aside className="cart-summary">
        <span className="eyebrow">Resumen</span>
        <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <div className="summary-row"><span>Envío</span><span>Se calcula al confirmar</span></div>
        <div className="summary-total"><span>Total estimado</span><strong>{formatPrice(subtotal)}</strong></div>
        <p>Los precios son informativos. Esta demostración no procesa pagos.</p>
        <Link href="/productos" className="button-primary">Seguir explorando <ArrowRight size={17} /></Link>
      </aside>
    </div>
  );
}
