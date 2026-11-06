import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Tu carrito",
  description: "Revisa los productos guardados en tu carrito TechNova.",
};

export default function CartPage() {
  return (
    <section className="container cart-page">
      <div className="cart-page-heading">
        <span className="eyebrow">Tu selección</span>
        <h1>Tu carrito</h1>
        <p>Revisa tus productos antes de seguir explorando.</p>
      </div>
      <CartView />
    </section>
  );
}
