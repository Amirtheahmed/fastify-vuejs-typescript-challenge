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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByIdHandler = exports.deleteProductHandler = exports.updateProductHandler = exports.getProductsHandler = exports.createProductHandler = void 0;
const product_service_1 = require("./product.service");
const category_service_1 = require("../category/category.service");
const sharp_1 = __importDefault(require("sharp"));
const file_1 = require("../../utils/file");
function createProductHandler(request, reply) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const parts = request.parts();
        const productData = { name: "", categoryId: 0 };
        let productPictureBuffer;
        let productPictureFilename = "imageFileName.jpg";
        try {
            for (var _d = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = yield parts_1.next(), _a = parts_1_1.done, !_a;) {
                _c = parts_1_1.value;
                _d = false;
                try {
                    const part = _c;
                    if (part.file) {
                        productPictureBuffer = yield part.toBuffer();
                        productPictureFilename = `${Date.now()}-${part.filename}`;
                        productPictureFilename = productPictureFilename.replace(/\s/g, "");
                    }
                    else {
                        const fieldName = part.fieldname;
                        // eslint-disable-next-line
                        // @ts-ignore
                        if (part.fields && typeof part.value === "string") {
                            // eslint-disable-next-line
                            // @ts-ignore
                            productData[fieldName] = part.value;
                        }
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = parts_1.return)) yield _b.call(parts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!productPictureBuffer) {
            return reply.status(400).send({ message: "Image is required" });
        }
        const categoryId = parseInt(productData.categoryId, 10);
        const category = yield (0, category_service_1.findCategoryById)(categoryId);
        if (!category) {
            return reply.status(404).send({ message: "Category does not exist" });
        }
        const resizedImageBuffer = yield (0, sharp_1.default)(productPictureBuffer)
            .resize(3200, 3200)
            .toBuffer();
        const imageUrl = yield (0, file_1.saveImage)(resizedImageBuffer, `${productPictureFilename}`);
        const finalProductData = Object.assign(Object.assign({}, productData), { picture: imageUrl, categoryId: categoryId });
        try {
            const product = yield (0, product_service_1.createProduct)(finalProductData);
            return reply.code(201).send(product);
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return reply.code(500).send(e.message);
            }
        }
    });
}
exports.createProductHandler = createProductHandler;
function getProductsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filterByName, sortBy, sortOrder } = request.query;
            let { page, limit, filterByCategory } = request.query;
            page = parseInt(page, 10) || 1;
            limit = parseInt(limit, 10) || 10;
            filterByCategory = parseInt(filterByCategory, 10);
            const skip = (page - 1) * limit;
            const products = yield (0, product_service_1.getProducts)({
                page: skip,
                limit: limit,
                filterByName: filterByName,
                filterByCategory: filterByCategory,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            return reply.code(200).send(products);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.getProductsHandler = getProductsHandler;
function updateProductHandler(request, reply) {
    var _a, e_2, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(request.params.id, 10);
        const parts = request.parts();
        const productData = {};
        let productPictureBuffer = null;
        let productPictureFilename = null;
        try {
            for (var _d = true, parts_2 = __asyncValues(parts), parts_2_1; parts_2_1 = yield parts_2.next(), _a = parts_2_1.done, !_a;) {
                _c = parts_2_1.value;
                _d = false;
                try {
                    const part = _c;
                    // Check if part is a file part
                    if (part.file) {
                        const filePart = part;
                        productPictureBuffer = yield filePart.toBuffer();
                        productPictureFilename = filePart.filename;
                    }
                    else {
                        // Handle field part
                        const fieldName = part.fieldname;
                        // Here, we need to access part.value safely
                        // Ensure that part.value exists and is of type string
                        if ("value" in part && typeof part["value"] === "string") {
                            // eslint-disable-next-line
                            // @ts-ignore
                            productData[fieldName] = part["value"];
                        }
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = parts_2.return)) yield _b.call(parts_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            const product = yield (0, product_service_1.findProductById)(id);
            if (!product) {
                return reply.status(404).send({ message: "Product not found" });
            }
            if (productData.categoryId) {
                productData.categoryId = parseInt(productData.categoryId, 10);
                const category = yield (0, category_service_1.findCategoryById)(productData.categoryId);
                if (!category) {
                    return reply.status(404).send({ message: "Category does not exist" });
                }
            }
            // If a new image is uploaded, resize and save it
            if (productPictureBuffer && productPictureFilename) {
                // remove existing image
                if (product.picture) {
                    const imagePath = (0, file_1.getProductImagePath)(product.picture);
                    // Check if image file exists, then delete it
                    const exists = yield (0, file_1.fileExists)(imagePath);
                    if (exists) {
                        yield (0, file_1.unlink)(imagePath);
                    }
                }
                const resizedImageBuffer = yield (0, sharp_1.default)(productPictureBuffer)
                    .resize(3200, 3200)
                    .toBuffer();
                productData.picture = yield (0, file_1.saveImage)(resizedImageBuffer, `${productPictureFilename}`);
            }
            const updatedProduct = yield (0, product_service_1.updateProduct)(id, productData);
            return reply.code(200).send(updatedProduct);
        }
        catch (e) {
            if (e instanceof Error) {
                return reply.code(500).send(e.message);
            }
        }
    });
}
exports.updateProductHandler = updateProductHandler;
function deleteProductHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(request.params.id, 10);
        try {
            const product = yield (0, product_service_1.findProductById)(id);
            if (!product) {
                return reply.status(404).send({ message: "Product not found" });
            }
            // If the product has an associated image, delete it
            if (product.picture) {
                const imagePath = (0, file_1.getProductImagePath)(product.picture); // Implement this function
                yield (0, file_1.unlink)(imagePath);
            }
            yield (0, product_service_1.deleteProduct)(id);
            return reply.code(204).send();
        }
        catch (e) {
            console.error(e);
            return reply.code(500).send(e);
        }
    });
}
exports.deleteProductHandler = deleteProductHandler;
function getProductByIdHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id } = request.params;
        id = parseInt(id, 10);
        try {
            const product = yield (0, product_service_1.findProductById)(id);
            return reply.code(200).send(product);
        }
        catch (e) {
            return reply.code(500).send(e);
        }
    });
}
exports.getProductByIdHandler = getProductByIdHandler;
