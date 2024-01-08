import { FastifyInstance } from "fastify";
import {
  createProductHandler,
  deleteProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
} from "./product.controller";
import { productRef } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        response: {
          201: productRef("productResponseSchema"),
        },
      },
    },
    createProductHandler,
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: productRef("productsResponseSchema"),
        },
      },
    },
    getProductsHandler,
  );

  server.post(
    "/:id",
    {
      schema: {
        response: {
          200: productRef("productResponseSchema"),
        },
      },
    },
    updateProductHandler,
  );

  server.get(
    "/:id",
    {
      schema: {
        response: {
          200: productRef("productResponseSchema"),
        },
      },
    },
    getProductByIdHandler,
  );

  server.delete("/:id", {}, deleteProductHandler);
}

export default productRoutes;
