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
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const user_schema_1 = require("./modules/user/user.schema");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const category_schema_1 = require("./modules/category/category.schema");
const category_route_1 = __importDefault(require("./modules/category/category.route"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const product_schema_1 = require("./modules/product/product.schema");
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("@fastify/cors"));
const static_1 = __importDefault(require("@fastify/static"));
// eslint-disable-next-line
// @ts-ignore
global.__basedir = path_1.default.resolve();
exports.server = (0, fastify_1.default)();
const swaggerOptions = {
    swagger: {
        info: {
            title: "Vartur Rest Api",
            description: "Fastify based REST API challenge",
            version: "1.0.0",
        },
    },
};
const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};
exports.server.register(swagger_1.default, swaggerOptions);
exports.server.register(swagger_ui_1.default, swaggerUiOptions);
exports.server.register(jwt_1.default, {
    secret: "sjd9wusansc9sauwq09nc89dskjcbk",
});
exports.server.register(multipart_1.default);
exports.server.register(cors_1.default);
exports.server.register(static_1.default, {
    root: path_1.default.join(__dirname, "../uploads"),
    prefix: "/uploads",
});
// add jwt authentication decorator
exports.server.decorate("authenticate", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield request.jwtVerify();
        }
        catch (e) {
            return response.send(e);
        }
    });
});
exports.server.get("/healthcheck", function () {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            status: "OK",
        };
    });
});
// register schemas
for (const schema of [...user_schema_1.userSchemas, ...category_schema_1.categorySchemas, ...product_schema_1.productSchemas]) {
    exports.server.addSchema(schema);
}
exports.server.register(user_route_1.default, { prefix: "api/users" });
exports.server.register(category_route_1.default, { prefix: "api/categories" });
exports.server.register(product_route_1.default, { prefix: "api/products" });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.server.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
                if (err)
                    throw err;
            });
            console.log("Server ready at http://localhost:3000");
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
main();
