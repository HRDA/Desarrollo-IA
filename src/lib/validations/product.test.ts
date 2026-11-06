import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { productQuerySchema } from "@/lib/validations/product";

describe("productQuerySchema", () => {
  it("applies safe defaults and accepts supported filters", () => {
    assert.deepEqual(productQuerySchema.parse({ category: "laptops", limit: "5", sortBy: "price" }), {
      category: "laptops", limit: 5, skip: 0, order: "asc", sortBy: "price",
    });
  });

  it("rejects unknown categories and out-of-range pagination", () => {
    assert.equal(productQuerySchema.safeParse({ category: "beauty" }).success, false);
    assert.equal(productQuerySchema.safeParse({ limit: 100 }).success, false);
    assert.equal(productQuerySchema.safeParse({ skip: -1 }).success, false);
  });
});
