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
exports.findCategoryById = exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createCategory(inputData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.category.create({
            data: {
                name: inputData.name,
                parentId: (_a = inputData.parentId) !== null && _a !== void 0 ? _a : null,
            },
        });
    });
}
exports.createCategory = createCategory;
function getCategories(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = params.filterByName
            ? {
                name: {
                    contains: params.filterByName,
                },
            }
            : {};
        const orderBy = {
            [params.sortBy]: params.sortOrder,
        };
        return prisma_1.default.category.findMany({
            skip: params.page,
            take: params.limit,
            where: where,
            orderBy: orderBy,
            include: {
                parentCategory: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: { products: true },
                },
            },
        });
    });
}
exports.getCategories = getCategories;
function updateCategory(id, updateData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.category.update({
            where: { id: id },
            data: {
                name: updateData.name,
                parentId: (_a = updateData.parentId) !== null && _a !== void 0 ? _a : null,
            },
        });
    });
}
exports.updateCategory = updateCategory;
function deleteCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.category.delete({
            where: { id },
        });
    });
}
exports.deleteCategory = deleteCategory;
function findCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                parentCategory: {
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
exports.findCategoryById = findCategoryById;
