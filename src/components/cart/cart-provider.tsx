"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import {
  addCartItem,
  getCartSummary,
  removeCartItem,
  updateCartItemQuantity,
} from "@/components/cart/cart-state";
import type { CartLine } from "@/components/cart/cart-state";
import { productSchema } from "@/lib/validations/product";
import type { Product } from "@/types/product";

export type { CartLine } from "@/components/cart/cart-state";

const STORAGE_KEY = "technova-cart";
const cartLineSchema = z.object({
  product: productSchema,
  quantity: z.number().int().min(1).max(99),
});

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  storageWarning: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface StoreSnapshot {
  items: CartLine[];
  storageWarning: string | null;
  isReady: boolean;
}

const serverSnapshot: StoreSnapshot = { items: [], storageWarning: null, isReady: false };
const subscribers = new Set<() => void>();

function discardStoredSnapshot(): StoreSnapshot {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("No se pudieron eliminar los datos inválidos del carrito.", error);
    return {
      ...serverSnapshot,
      storageWarning: "No se pudieron limpiar los datos inválidos del carrito.",
      isReady: true,
    };
  }
  return { ...serverSnapshot, storageWarning: "Se descartaron datos de carrito no válidos.", isReady: true };
}

function readStoredSnapshot(): StoreSnapshot {
  let saved: string | null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("No se pudo leer el carrito guardado.", error);
    return {
      ...serverSnapshot,
      storageWarning: "No se pudo leer el carrito guardado en este navegador.",
      isReady: true,
    };
  }
  if (!saved) return { ...serverSnapshot, isReady: true };

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    console.error("No se pudo interpretar el carrito guardado.", error);
    return discardStoredSnapshot();
  }

  const result = z.array(cartLineSchema).safeParse(parsed);
  if (!result.success) return discardStoredSnapshot();
  return { items: result.data, storageWarning: null, isReady: true };
}

let snapshot = typeof window === "undefined" ? serverSnapshot : readStoredSnapshot();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notify() {
  subscribers.forEach((callback) => callback());
}

function saveSnapshot(items: CartLine[]) {
  let storageWarning: string | null = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("No se pudo guardar el carrito en este navegador.", error);
    storageWarning = "El navegador no permitió guardar el carrito. Tus cambios podrían perderse.";
  }
  snapshot = { items, storageWarning, isReady: true };
  notify();
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, storageWarning, isReady } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addToCart = useCallback((product: Product, quantity = 1) => {
    saveSnapshot(addCartItem(snapshot.items, product, quantity));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    saveSnapshot(updateCartItemQuantity(snapshot.items, productId, quantity));
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    saveSnapshot(removeCartItem(snapshot.items, productId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      ...getCartSummary(items),
      isReady,
      storageWarning,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [items, isReady, storageWarning, addToCart, updateQuantity, removeFromCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
