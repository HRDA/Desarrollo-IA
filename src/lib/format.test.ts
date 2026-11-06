import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats prices in USD", () => {
    assert.equal(formatPrice(1234.5), "$1,234.50");
  });
});
