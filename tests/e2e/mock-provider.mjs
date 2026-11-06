import { createServer } from "node:http";

const port = Number(process.env.MOCK_PROVIDER_PORT ?? 4173);
const image = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=801&q=80";
const products = [
  {
    id: 1,
    title: "TechNova Phone",
    description: "Smartphone de prueba para validar el catálogo.",
    category: "smartphones",
    price: 100,
    discountPercentage: 10,
    rating: 4.8,
    stock: 10,
    brand: "TechNova",
    thumbnail: image,
    images: [image],
    availabilityStatus: "En stock",
  },
  {
    id: 2,
    title: "TechNova Laptop",
    description: "Laptop de prueba para validar filtros y ordenamiento.",
    category: "laptops",
    price: 200,
    discountPercentage: 5,
    rating: 4.5,
    stock: 5,
    brand: "TechNova",
    thumbnail: image,
    images: [image],
    availabilityStatus: "En stock",
  },
  {
    id: 3,
    title: "TechNova Tablet",
    description: "Tablet de prueba con precio menor.",
    category: "tablets",
    price: 50,
    discountPercentage: 0,
    rating: 4.2,
    stock: 8,
    brand: "TechNova",
    thumbnail: image,
    images: [image],
    availabilityStatus: "En stock",
  },
];

function respond(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;

  if (pathname === "/health") {
    respond(response, 200, { status: "ok" });
    return;
  }

  const productPath = pathname.match(/\/products(?:\/(\d+))?$/);
  if (request.method !== "GET" || !productPath) {
    respond(response, 404, { message: "Not found" });
    return;
  }

  if (productPath[1] === "503") {
    respond(response, 503, { message: "Mock provider internal failure detail" });
    return;
  }

  if (!productPath[1]) {
    respond(response, 200, { products, total: products.length, skip: 0, limit: products.length });
    return;
  }

  const id = Number(productPath[1]);
  const product = products.find((candidate) => candidate.id === id);
  respond(response, product ? 200 : 404, product ?? { message: "Product not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Playwright mock provider listening on 127.0.0.1:${port}`);
});
