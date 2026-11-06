"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/types/product";

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
}: {
  product: Product;
  quantity?: number;
  compact?: boolean;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.stock < 1}
      className={`button-primary ${compact ? "button-icon" : ""}`}
      aria-label={`Agregar ${product.title} al carrito`}
    >
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {!compact && <span>{product.stock < 1 ? "Agotado" : added ? "Agregado" : "Agregar al carrito"}</span>}
    </button>
  );
}
