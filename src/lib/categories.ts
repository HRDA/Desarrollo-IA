import type { ProductCategory } from "@/types/product";

export const categories: { id: ProductCategory; label: string; description: string }[] = [
  { id: "smartphones", label: "Smartphones", description: "Tecnología que va contigo" },
  { id: "laptops", label: "Laptops", description: "Potencia para tus ideas" },
  { id: "tablets", label: "Tablets", description: "Todo en una gran pantalla" },
  { id: "mobile-accessories", label: "Accesorios", description: "El complemento perfecto" },
];
