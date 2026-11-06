import { productCategorySchema, productSchema, providerProductListSchema } from "@/lib/validations/product";
import type { Product, ProductList, ProductQuery } from "@/types/product";
import { categories } from "@/lib/categories";

const BASE_URL = (process.env.DUMMYJSON_BASE_URL ?? "https://dummyjson.com").replace(/\/+$/, "");
const REQUEST_TIMEOUT_MS = 8_000;

export class ProductServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

async function fetchJson(url: string): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: 300 },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ProductServiceError("El proveedor de productos tardó demasiado.", 504);
    }
    throw new ProductServiceError("No fue posible conectar con el proveedor de productos.", 502);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ProductServiceError("Producto no encontrado.", 404);
    }
    throw new ProductServiceError("El proveedor de productos no está disponible.", 502);
  }

  try {
    return await response.json();
  } catch {
    throw new ProductServiceError("El proveedor devolvió una respuesta inválida.", 502);
  }
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductList> {
  const raw = await fetchJson(`${BASE_URL}/products?limit=0`);
  const parsed = providerProductListSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ProductServiceError("El proveedor devolvió productos con un formato inválido.", 502);
  }

  const allowedCategories = new Set<string>(categories.map(({ id }) => id));
  let products: Product[] = [];
  for (const product of parsed.data.products) {
    if (!allowedCategories.has(product.category)) continue;
    const category = productCategorySchema.safeParse(product.category);
    if (category.success) products.push({ ...product, category: category.data });
  }

  if (query.q) {
    const term = query.q.toLocaleLowerCase();
    products = products.filter(({ title, description, brand }) =>
      `${title} ${description} ${brand ?? ""}`.toLocaleLowerCase().includes(term),
    );
  }

  if (query.category) {
    products = products.filter((product) => product.category === query.category);
  }

  if (query.sortBy) {
    const direction = query.order === "desc" ? -1 : 1;
    const key = query.sortBy;
    products = [...products].sort((a, b) => {
      const left = a[key] ?? 0;
      const right = b[key] ?? 0;
      if (typeof left === "string" && typeof right === "string") {
        return left.localeCompare(right) * direction;
      }
      return (Number(left) - Number(right)) * direction;
    });
  }

  const total = products.length;
  const skip = query.skip ?? 0;
  const limit = query.limit ?? total;

  return {
    products: products.slice(skip, skip + limit),
    total,
    skip,
    limit,
  };
}

export async function getProductById(id: number): Promise<Product> {
  const raw = await fetchJson(`${BASE_URL}/products/${id}`);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ProductServiceError("El proveedor devolvió un producto con un formato inválido.", 502);
  }
  if (!categories.some(({ id: category }) => category === parsed.data.category)) {
    throw new ProductServiceError("Producto no encontrado.", 404);
  }
  return parsed.data;
}
