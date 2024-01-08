"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRef = exports.categorySchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const categoryInput = {
    name: zod_1.z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be string",
    }),
    parentId: zod_1.z
        .number({
        invalid_type_error: "parentId must be a valid integer",
    })
        .nullable()
        .optional(),
};
const categoryGenerated = {
    id: zod_1.z.number(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
};
const createCategorySchema = zod_1.z.object(Object.assign({}, categoryInput));
const updateCategorySchema = createCategorySchema.partial();
const productCountSchema = zod_1.z.object({
    products: zod_1.z.number(),
});
// eslint-disable-next-line
const categoryResponseSchema = zod_1.z.object(Object.assign(Object.assign(Object.assign({}, categoryInput), categoryGenerated), { parentCategory: zod_1.z
        .lazy(() => categoryResponseSchema)
        .nullable()
        .optional(), _count: productCountSchema.optional() }));
const categoriesResponseSchema = zod_1.z.array(categoryResponseSchema);
const listCategoriesQuerySchema = zod_1.z.object({
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
    filterByName: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["name", "id", "createdAt", "updatedAt"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createCategorySchema,
    categoryResponseSchema,
    categoriesResponseSchema,
    updateCategorySchema,
}, { $id: "CategorySchema" }), exports.categorySchemas = _a.schemas, exports.categoryRef = _a.$ref;
