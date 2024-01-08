"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRef = exports.productSchemas = void 0;
const zod_1 = require("zod");
const fastify_zod_1 = require("fastify-zod");
const productInput = {
    name: zod_1.z.string(),
    picture: zod_1.z.string(),
    categoryId: zod_1.z.number(),
};
const productGenerated = {
    id: zod_1.z.number(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
};
const createProductSchema = zod_1.z.object(Object.assign({}, productInput));
const updateProductSchema = createProductSchema.partial();
const categorySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
const productResponseSchema = zod_1.z.object(Object.assign(Object.assign(Object.assign({}, productInput), productGenerated), { category: categorySchema }));
const productsResponseSchema = zod_1.z.array(productResponseSchema);
const listProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
    filterByName: zod_1.z.string().optional(),
    filterByCategory: zod_1.z.number().optional(),
    sortBy: zod_1.z
        .enum(["name", "id", "createdAt", "updatedAt"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
    updateProductSchema,
}, {
    $id: "ProductSchema",
}), exports.productSchemas = _a.schemas, exports.productRef = _a.$ref;
