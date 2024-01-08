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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryByIdHandler = exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.getCategoriesHandler = exports.createCategoryHandler = void 0;
const category_service_1 = require("./category.service");
function createCategoryHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        try {
            const category = yield (0, category_service_1.createCategory)(body);
            return reply.code(201).send(category);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.createCategoryHandler = createCategoryHandler;
function getCategoriesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { page, limit, filterByName, sortBy, sortOrder } = request.query;
            page = parseInt(page, 10) || 1;
            limit = parseInt(limit, 10) || 10;
            const skip = (page - 1) * limit;
            const categories = yield (0, category_service_1.getCategories)({
                page: skip,
                limit: limit,
                filterByName: filterByName,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            return reply.code(200).send(categories);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.getCategoriesHandler = getCategoriesHandler;
function updateCategoryHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id } = request.params;
        const data = request.body;
        id = parseInt(id, 10);
        try {
            const category = yield (0, category_service_1.findCategoryById)(id);
            if (!category) {
                return reply.code(404).send({
                    message: "Category not found",
                });
            }
            const updatedCategory = yield (0, category_service_1.updateCategory)(category.id, data);
            return reply.code(200).send(updatedCategory);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.updateCategoryHandler = updateCategoryHandler;
function deleteCategoryHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id } = request.params;
        id = parseInt(id, 10);
        try {
            yield (0, category_service_1.deleteCategory)(id);
            return reply.code(204).send();
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.deleteCategoryHandler = deleteCategoryHandler;
function getCategoryByIdHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id } = request.params;
        id = parseInt(id, 10);
        try {
            const category = yield (0, category_service_1.findCategoryById)(id);
            return reply.code(200).send(category);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.getCategoryByIdHandler = getCategoryByIdHandler;
