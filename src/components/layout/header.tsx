"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";

export function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/productos?q=${encodeURIComponent(query)}` : "/productos");
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="announcement">
        Envío gratis en compras mayores a $100 <span>·</span> Tecnología que inspira
      </div>
      <div className="container header-main">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link href="/" className="brand" aria-label="TechNova Store, inicio">
          <span className="brand-mark"><span /></span>
          <span>TechNova<span className="brand-light"> Store</span></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
          <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/productos" onClick={() => setMenuOpen(false)}>Productos</Link>
          <a href="/#categorias" onClick={() => setMenuOpen(false)}>Categorías</a>
        </nav>
        <form className="header-search" onSubmit={handleSearch} role="search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar productos"
          />
          <button type="submit" aria-label="Buscar">Buscar</button>
        </form>
        <Link className="cart-link" href="/carrito" aria-label={`Carrito, ${itemCount} artículos`}>
          <ShoppingBag size={21} />
          <span className="cart-label">Carrito</span>
          <span className="cart-count">{itemCount > 99 ? "99+" : itemCount}</span>
        </Link>
      </div>
    </header>
  );
}
