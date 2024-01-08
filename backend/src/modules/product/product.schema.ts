import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
  name: z.string(),
  picture: z.string(),
  categoryId: z.number(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...productInput,
});

const updateProductSchema = createProductSchema.partial();

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
  category: categorySchema,
});

const productsResponseSchema = z.array(productResponseSchema);

const listProductsQuerySchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  filterByName: z.string().optional(),
  filterByCategory: z.number().optional(),
  sortBy: z
    .enum(["name", "id", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const { schemas: productSchemas, $ref: productRef } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
    updateProductSchema,
  },
  {
    $id: "ProductSchema",
  },
);
