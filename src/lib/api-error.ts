import { ProductServiceError } from "@/services/product-service";

export function apiErrorResponse(error: unknown): Response {
  if (error instanceof ProductServiceError) {
    const code = error.status === 404 ? "NOT_FOUND" : error.status === 504 ? "UPSTREAM_TIMEOUT" : "UPSTREAM_ERROR";
    return Response.json({ error: { code, message: error.message } }, { status: error.status });
  }

  console.error("Error inesperado en la API de productos.", error);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Ocurrió un error inesperado." } },
    { status: 500 },
  );
}
