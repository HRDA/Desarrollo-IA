import { expect, test } from "@playwright/test";

test("navigates through home, catalog, product detail, and cart", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (/hydration|did not match|server rendered html/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => hydrationErrors.push(error.message));

  await page.goto("/productos/1");
  await expect(page.getByRole("heading", { name: "TechNova Phone" })).toBeVisible();
  await page.goto("/productos");
  await expect(page.getByRole("heading", { name: /Tecnología para/ })).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /La tecnología/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explora por categoría" })).toBeVisible();
  await expect(page.locator(".hero-image")).toHaveCount(1);
  await expect.poll(
    () => page.locator(".hero-image").evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Productos", exact: true }).click();
  await expect(page).toHaveURL(/\/productos$/);
  await expect(page.getByRole("heading", { name: /Tecnología para/ })).toBeVisible();

  await page.getByRole("link", { name: "Ver TechNova Phone" }).first().click();
  await expect(page).toHaveURL(/\/productos\/1$/);
  await expect(page.getByRole("heading", { name: "TechNova Phone" })).toBeVisible();
  await expect(page.getByText("$100.00")).toBeVisible();
  await page.getByRole("link", { name: /Carrito, 0 artículos/ }).click();
  await expect(page).toHaveURL(/\/carrito$/);
  await expect(page.getByRole("heading", { name: "Tu carrito", exact: true })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("searches, filters, and orders catalog products", async ({ page }) => {
  await page.goto("/productos");
  await expect(page.locator(".product-card")).toHaveCount(3);

  await page.getByRole("button", { name: /Laptops/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "TechNova Laptop" })).toBeVisible();

  await page.getByRole("button", { name: /Todas/ }).click();
  await page.getByRole("textbox", { name: "Buscar productos del catálogo" }).fill("Tablet");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "TechNova Tablet" })).toBeVisible();

  await page.getByRole("textbox", { name: "Buscar productos del catálogo" }).fill("");
  await page.getByRole("combobox", { name: "Ordenar productos" }).selectOption("price-asc");
  await expect(page.locator(".product-card").first()).toContainText("TechNova Tablet");
});

test("adds from detail, updates totals, survives reload, and can be emptied", async ({ page }) => {
  await page.goto("/productos/1");
  await page.getByRole("button", { name: "Aumentar cantidad" }).click();
  await expect(page.locator(".purchase-panel output")).toHaveText("2");
  await page.getByRole("button", { name: "Agregar TechNova Phone al carrito" }).click();
  await page.getByRole("link", { name: "Carrito, 2 artículos" }).click();

  const cartLine = page.locator(".cart-line");
  await expect(cartLine.locator("output")).toHaveText("2");
  await expect(page.locator(".summary-total strong")).toHaveText("$200.00");
  await page.getByRole("button", { name: "Aumentar cantidad de TechNova Phone" }).click();
  await expect(cartLine.locator("output")).toHaveText("3");
  await expect(page.locator(".summary-total strong")).toHaveText("$300.00");
  await page.getByRole("button", { name: "Reducir cantidad de TechNova Phone" }).click();
  await expect(page.locator(".summary-total strong")).toHaveText("$200.00");

  await page.reload();
  await expect(page.locator(".cart-line").locator("output")).toHaveText("2");
  await page.getByRole("button", { name: "Eliminar TechNova Phone" }).click();
  await expect(page.getByRole("heading", { name: "Tu carrito está esperando algo especial" })).toBeVisible();
  await expect(page.locator(".summary-total")).toHaveCount(0);
});

test("shows the empty cart and removes malformed persisted data", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("technova-cart", "{broken json");
  });

  await page.goto("/carrito");
  await expect(page.getByRole("heading", { name: "Tu carrito está esperando algo especial" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Se descartaron datos de carrito no válidos.");
  expect(await page.evaluate(() => window.localStorage.getItem("technova-cart"))).toBeNull();

  await page.evaluate(() => {
    window.localStorage.setItem("technova-cart", JSON.stringify([{ product: {}, quantity: 100 }]));
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Tu carrito está esperando algo especial" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Se descartaron datos de carrito no válidos.");
  expect(await page.evaluate(() => window.localStorage.getItem("technova-cart"))).toBeNull();
});

test("keeps upstream errors generic and handles missing products", async ({ page, request }) => {
  const invalidQueryResponse = await request.get("/api/products?limit=0");
  expect(invalidQueryResponse.status()).toBe(400);
  expect((await invalidQueryResponse.json()).error.code).toBe("INVALID_QUERY");

  const apiResponse = await request.get("/api/products/503");
  expect(apiResponse.status()).toBe(502);
  const apiBody = await apiResponse.json();
  expect(apiBody.error).toEqual({
    code: "UPSTREAM_ERROR",
    message: "El proveedor de productos no está disponible.",
  });
  expect(JSON.stringify(apiBody)).not.toContain("Mock provider internal failure detail");

  await page.goto("/productos/503");
  await expect(page.getByRole("heading", { name: "No pudimos cargar esta página" })).toBeVisible();
  await expect(page.getByText("Mock provider internal failure detail")).toHaveCount(0);

  await page.goto("/productos/999");
  await expect(page.getByRole("heading", { name: "Este producto no está disponible" })).toBeVisible();
});

test("keeps the mobile navigation usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeVisible();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
  await page.getByRole("link", { name: "Productos", exact: true }).click();
  await expect(page).toHaveURL(/\/productos$/);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
});
