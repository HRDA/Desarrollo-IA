import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCartItem,
  getCartSummary,
  removeCartItem,
  updateCartItemQuantity,
  type CartLine,
} from "@/components/cart/cart-state";
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  title: "Test Phone",
  description: "A test phone",
  category: "smartphones",
  price: 12.5,
  stock: 10,
  thumbnail: "https://cdn.dummyjson.com/product-images/smartphones/test/thumbnail.webp",
  images: [],
};
const secondProduct: Product = { ...product, id: 2, price: 20 };

describe("cart state", () => {
  it("adds items and merges quantities without exceeding the limit", () => {
    const oneItem = addCartItem([], product, 2);
    const merged = addCartItem(oneItem, product, 98);

    assert.deepEqual(merged, [{ product, quantity: 99 }]);
    assert.deepEqual(addCartItem([], product, Number.NaN), [{ product, quantity: 1 }]);
  });

  it("updates quantities, removes zero-quantity items, and caps quantities", () => {
    const items: CartLine[] = [
      { product, quantity: 2 },
      { product: secondProduct, quantity: 1 },
    ];

    assert.deepEqual(updateCartItemQuantity(items, product.id, 120), [
      { product, quantity: 99 },
      { product: secondProduct, quantity: 1 },
    ]);
    assert.deepEqual(updateCartItemQuantity(items, product.id, 0), [
      { product: secondProduct, quantity: 1 },
    ]);
  });

  it("removes items and calculates item count and subtotal", () => {
    const items: CartLine[] = [
      { product, quantity: 2 },
      { product: secondProduct, quantity: 1 },
    ];

    assert.deepEqual(getCartSummary(items), { itemCount: 3, subtotal: 45 });
    assert.deepEqual(removeCartItem(items, product.id), [{ product: secondProduct, quantity: 1 }]);
  });
});
