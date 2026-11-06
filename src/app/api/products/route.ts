import { productQuerySchema } from "@/lib/validations/product";
import { apiErrorResponse } from "@/lib/api-error";
import { getProducts } from "@/services/product-service";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = productQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!query.success) {
    return Response.json(
      { error: { code: "INVALID_QUERY", message: "Los parámetros de búsqueda no son válidos." } },
      { status: 400 },
    );
  }

  try {
    return Response.json(await getProducts(query.data));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
