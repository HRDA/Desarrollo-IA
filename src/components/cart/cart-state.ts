import type { Product } from "@/types/product";

export interface CartLine {
  product: Product;
  quantity: number;
}

export function addCartItem(items: CartLine[], product: Product, quantity: number): CartLine[] {
  const requested = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  const amount = Math.min(99, Math.max(1, requested));
  const existing = items.find((line) => line.product.id === product.id);

  return existing
    ? items.map((line) =>
        line.product.id === product.id
          ? { ...line, quantity: Math.min(99, line.quantity + amount) }
          : line,
      )
    : [...items, { product, quantity: amount }];
}

export function updateCartItemQuantity(
  items: CartLine[],
  productId: number,
  quantity: number,
): CartLine[] {
  const amount = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  if (amount < 1) return items.filter((line) => line.product.id !== productId);

  return items.map((line) =>
    line.product.id === productId ? { ...line, quantity: Math.min(99, amount) } : line,
  );
}

export function removeCartItem(items: CartLine[], productId: number): CartLine[] {
  return items.filter((line) => line.product.id !== productId);
}

export function getCartSummary(items: CartLine[]) {
  return {
    itemCount: items.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: items.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  };
}
