import { z } from "zod";
import { apiErrorResponse } from "@/lib/api-error";
import { getProductById } from "@/services/product-service";

const productIdSchema = z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().int().positive());

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsedId = productIdSchema.safeParse(id);
  if (!parsedId.success) {
    return Response.json(
      { error: { code: "INVALID_ID", message: "El identificador del producto no es válido." } },
      { status: 400 },
    );
  }

  try {
    return Response.json(await getProductById(parsedId.data));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
