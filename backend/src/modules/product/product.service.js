"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductById = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createProduct(inputData) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.product.create({
            data: {
                name: inputData.name,
                picture: inputData.picture,
                categoryId: inputData.categoryId,
            },
            include: {
                category: true,
            },
        });
    });
}
exports.createProduct = createProduct;
function getProducts(params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Construct where object conditionally based on filters
        const where = Object.assign(Object.assign({}, (params.filterByName && {
            name: {
                contains: params.filterByName,
            },
        })), (params.filterByCategory && {
            categoryId: {
                equals: params.filterByCategory,
            },
        }));
        const orderBy = {
            [params.sortBy]: params.sortOrder,
        };
        return prisma_1.default.product.findMany({
            skip: params.page,
            take: params.limit,
            where: where,
            orderBy: orderBy,
            include: {
                category: true,
            },
        });
    });
}
exports.getProducts = getProducts;
function updateProduct(id, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.product.update({
            where: { id: id },
            data: {
                name: updateData.name,
                picture: updateData.picture,
                categoryId: updateData.categoryId,
            },
            include: {
                category: true,
            },
        });
    });
}
exports.updateProduct = updateProduct;
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.product.delete({
            where: { id },
        });
    });
}
exports.deleteProduct = deleteProduct;
function findProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                picture: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    });
}
exports.findProductById = findProductById;
