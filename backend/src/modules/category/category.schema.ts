import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const categoryInput = {
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be string",
  }),
  parentId: z
    .number({
      invalid_type_error: "parentId must be a valid integer",
    })
    .nullable()
    .optional(),
};

const categoryGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createCategorySchema = z.object({
  ...categoryInput,
});

const updateCategorySchema = createCategorySchema.partial();

const productCountSchema = z.object({
  products: z.number(),
});

// eslint-disable-next-line
const categoryResponseSchema: any = z.object({
  ...categoryInput,
  ...categoryGenerated,
  parentCategory: z
    .lazy(() => categoryResponseSchema)
    .nullable()
    .optional(),
  _count: productCountSchema.optional(),
});

const categoriesResponseSchema = z.array(categoryResponseSchema);

const listCategoriesQuerySchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  filterByName: z.string().optional(),
  sortBy: z
    .enum(["name", "id", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
export const { schemas: categorySchemas, $ref: categoryRef } = buildJsonSchemas(
  {
    createCategorySchema,
    categoryResponseSchema,
    categoriesResponseSchema,
    updateCategorySchema,
  },
  { $id: "CategorySchema" },
);
