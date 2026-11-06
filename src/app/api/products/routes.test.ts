import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { GET as getProductsRoute } from "@/app/api/products/route";
import { GET as getProductRoute } from "@/app/api/products/[id]/route";

const image = "https://cdn.dummyjson.com/product-images/smartphones/test/thumbnail.webp";
const product = {
  id: 1,
  title: "Test Phone",
  description: "A test phone",
  category: "smartphones",
  price: 500,
  rating: 4.5,
  stock: 10,
  thumbnail: image,
  images: [image],
};
const originalFetch = globalThis.fetch;

function stubFetch(payload: unknown, status = 200) {
  globalThis.fetch = async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { "Content-Type": "application/json" },
    });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("product Route Handlers", () => {
  it("validates list query parameters", async () => {
    const response = await getProductsRoute(new Request("http://localhost/api/products?limit=0"));

    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, "INVALID_QUERY");
  });

  it("returns validated product lists", async () => {
    stubFetch({ products: [product], total: 1, skip: 0, limit: 1 });

    const response = await getProductsRoute(new Request("http://localhost/api/products?limit=1"));

    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).products.map(({ id }: { id: number }) => id), [1]);
  });

  it("maps upstream timeouts to a safe 504 response", async () => {
    globalThis.fetch = async () => {
      const error = new Error("internal timeout detail");
      error.name = "TimeoutError";
      throw error;
    };

    const response = await getProductsRoute(new Request("http://localhost/api/products"));
    const body = await response.json();

    assert.equal(response.status, 504);
    assert.deepEqual(body.error, {
      code: "UPSTREAM_TIMEOUT",
      message: "El proveedor de productos tardó demasiado.",
    });
    assert.equal(JSON.stringify(body).includes("internal timeout detail"), false);
  });

  it("validates detail IDs without calling the provider", async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response();
    };

    const response = await getProductRoute(new Request("http://localhost/api/products/0"), {
      params: Promise.resolve({ id: "0" }),
    });

    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, "INVALID_ID");
    assert.equal(fetchCalled, false);
  });

  it("returns a valid product by ID", async () => {
    stubFetch(product);

    const response = await getProductRoute(new Request("http://localhost/api/products/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    assert.equal(response.status, 200);
    assert.equal((await response.json()).id, product.id);
  });

  it("maps a missing upstream product to a 404 response", async () => {
    stubFetch({ message: "not found" }, 404);

    const response = await getProductRoute(new Request("http://localhost/api/products/999"), {
      params: Promise.resolve({ id: "999" }),
    });

    assert.equal(response.status, 404);
    assert.equal((await response.json()).error.code, "NOT_FOUND");
  });
});
