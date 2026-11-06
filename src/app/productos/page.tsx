import type { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { productCategorySchema } from "@/lib/validations/product";
import { getProducts } from "@/services/product-service";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora smartphones, laptops, tablets y accesorios tecnológicos.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = typeof params.q === "string" ? params.q : "";
  const initialQuery = rawQuery.length <= 100 ? rawQuery : "";
  const categoryResult = productCategorySchema.safeParse(params.category);
  const initialCategory = categoryResult.success ? categoryResult.data : undefined;
  const { products } = await getProducts({ limit: 50 });

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Encuentra lo que buscas</span>
          <h1>Tecnología para <em>cada día.</em></h1>
          <p>Una selección pensada para hacer más, crear más y disfrutar cada momento.</p>
        </div>
      </section>
      <section className="container catalog-section">
        <ProductCatalog products={products} initialQuery={initialQuery} initialCategory={initialCategory} />
      </section>
    </>
  );
}
