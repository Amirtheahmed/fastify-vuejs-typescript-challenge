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
const product_controller_1 = require("./product.controller");
const product_schema_1 = require("./product.schema");
function productRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", {
            schema: {
                response: {
                    201: (0, product_schema_1.productRef)("productResponseSchema"),
                },
            },
        }, product_controller_1.createProductHandler);
        server.get("/", {
            schema: {
                response: {
                    200: (0, product_schema_1.productRef)("productsResponseSchema"),
                },
            },
        }, product_controller_1.getProductsHandler);
        server.post("/:id", {
            schema: {
                response: {
                    200: (0, product_schema_1.productRef)("productResponseSchema"),
                },
            },
        }, product_controller_1.updateProductHandler);
        server.get("/:id", {
            schema: {
                response: {
                    200: (0, product_schema_1.productRef)("productResponseSchema"),
                },
            },
        }, product_controller_1.getProductByIdHandler);
        server.delete("/:id", {}, product_controller_1.deleteProductHandler);
    });
}
exports.default = productRoutes;
