import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { ProductServiceError, getProducts } from "@/services/product-service";

const image = "https://cdn.dummyjson.com/product-images/smartphones/test/thumbnail.webp";

function providerProduct(id: number, title: string, category: string, price: number) {
  return {
    id,
    title,
    description: `${title} description`,
    category,
    price,
    rating: 4.5,
    stock: 10,
    thumbnail: image,
    images: [image],
  };
}

function stubProducts(products: ReturnType<typeof providerProduct>[]) {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ products, total: products.length, skip: 0, limit: products.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("getProducts", () => {
  it("limits the provider catalog to supported categories", async () => {
    stubProducts([
      providerProduct(1, "Phone", "smartphones", 500),
      providerProduct(2, "Mascara", "beauty", 9),
      providerProduct(3, "Laptop", "laptops", 1000),
    ]);

    const result = await getProducts({ limit: 50 });

    assert.equal(result.total, 2);
    assert.deepEqual(result.products.map(({ category }) => category), ["smartphones", "laptops"]);
  });

  it("filters, sorts, and paginates the validated catalog", async () => {
    stubProducts([
      providerProduct(1, "Phone B", "smartphones", 900),
      providerProduct(2, "Phone A", "smartphones", 500),
      providerProduct(3, "Laptop", "laptops", 1000),
    ]);

    const result = await getProducts({
      category: "smartphones",
      sortBy: "price",
      order: "asc",
      skip: 1,
      limit: 1,
    });

    assert.equal(result.total, 2);
    assert.deepEqual(result.products.map(({ title }) => title), ["Phone B"]);
  });

  it("surfaces invalid provider payloads as service errors", async () => {
    globalThis.fetch = async () => new Response("{", { status: 200 });
    await assert.rejects(
      getProducts(),
      (error: unknown) => error instanceof ProductServiceError && error.status === 502,
    );
  });

  it("maps provider timeouts to a 504 service error", async () => {
    globalThis.fetch = async () => {
      const error = new Error("request timed out");
      error.name = "TimeoutError";
      throw error;
    };

    await assert.rejects(
      getProducts(),
      (error: unknown) => error instanceof ProductServiceError && error.status === 504,
    );
  });

  it("maps provider HTTP errors to service errors", async () => {
    globalThis.fetch = async () => new Response(null, { status: 404 });
    await assert.rejects(
      getProducts(),
      (error: unknown) => error instanceof ProductServiceError && error.status === 404,
    );

    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(
      getProducts(),
      (error: unknown) => error instanceof ProductServiceError && error.status === 502,
    );
  });

  it("maps network failures to a 502 service error", async () => {
    globalThis.fetch = async () => {
      throw new Error("network details");
    };

    await assert.rejects(
      getProducts(),
      (error: unknown) => error instanceof ProductServiceError && error.status === 502,
    );
  });
});
