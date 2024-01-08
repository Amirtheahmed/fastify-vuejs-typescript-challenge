import { FastifyInstance } from "fastify";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from "./category.controller";
import { categoryRef } from "./category.schema";

async function categoryRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: categoryRef("createCategorySchema"),
        response: {
          201: categoryRef("categoryResponseSchema"),
        },
      },
    },
    createCategoryHandler,
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: categoryRef("categoriesResponseSchema"),
        },
      },
    },
    getCategoriesHandler,
  );

  server.post(
    "/:id",
    {
      schema: {
        body: categoryRef("updateCategorySchema"),
        response: {
          200: categoryRef("categoryResponseSchema"),
        },
      },
    },
    updateCategoryHandler,
  );

  server.get(
    "/:id",
    {
      schema: {
        response: {
          200: categoryRef("categoryResponseSchema"),
        },
      },
    },
    getCategoryByIdHandler,
  );

  server.delete("/:id", {}, deleteCategoryHandler);
}

export default categoryRoutes;
