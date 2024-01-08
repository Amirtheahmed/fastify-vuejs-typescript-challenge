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
const category_controller_1 = require("./category.controller");
const category_schema_1 = require("./category.schema");
function categoryRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", {
            schema: {
                body: (0, category_schema_1.categoryRef)("createCategorySchema"),
                response: {
                    201: (0, category_schema_1.categoryRef)("categoryResponseSchema"),
                },
            },
        }, category_controller_1.createCategoryHandler);
        server.get("/", {
            schema: {
                response: {
                    200: (0, category_schema_1.categoryRef)("categoriesResponseSchema"),
                },
            },
        }, category_controller_1.getCategoriesHandler);
        server.post("/:id", {
            schema: {
                body: (0, category_schema_1.categoryRef)("updateCategorySchema"),
                response: {
                    200: (0, category_schema_1.categoryRef)("categoryResponseSchema"),
                },
            },
        }, category_controller_1.updateCategoryHandler);
        server.get("/:id", {
            schema: {
                response: {
                    200: (0, category_schema_1.categoryRef)("categoryResponseSchema"),
                },
            },
        }, category_controller_1.getCategoryByIdHandler);
        server.delete("/:id", {}, category_controller_1.deleteCategoryHandler);
    });
}
exports.default = categoryRoutes;
