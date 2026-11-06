"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Product } from "@/types/product";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const maximum = Math.max(1, Math.min(99, product.stock));

  return (
    <div className="purchase-panel">
      <div className="quantity-picker">
        <span>Cantidad</span>
        <div>
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Reducir cantidad"><Minus size={15} /></button>
          <output aria-live="polite">{quantity}</output>
          <button type="button" onClick={() => setQuantity((value) => Math.min(maximum, value + 1))} disabled={quantity >= maximum || product.stock < 1} aria-label="Aumentar cantidad"><Plus size={15} /></button>
        </div>
      </div>
      <AddToCartButton product={product} quantity={quantity} />
    </div>
  );
}
