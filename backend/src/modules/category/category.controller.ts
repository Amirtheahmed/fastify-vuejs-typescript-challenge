import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCategoryInput, ListCategoriesQuery } from "./category.schema";
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  getCategories,
  updateCategory,
} from "./category.service";

export async function createCategoryHandler(
  request: FastifyRequest<{
    Body: CreateCategoryInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const category = await createCategory(body);
    return reply.code(201).send(category);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function getCategoriesHandler(
  request: FastifyRequest<{
    Querystring: ListCategoriesQuery;
  }>,
  reply: FastifyReply,
) {
  try {
    let { page, limit, filterByName, sortBy, sortOrder } = request.query;

    page = parseInt(page as unknown as string, 10) || 1;
    limit = parseInt(limit as unknown as string, 10) || 10;

    const skip: number = (page - 1) * limit;

    const categories = await getCategories({
      page: skip,
      limit: limit,
      filterByName: filterByName,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    return reply.code(200).send(categories);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function updateCategoryHandler(
  request: FastifyRequest<{
    Body: Partial<CreateCategoryInput>;
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  let { id } = request.params;
  const data = request.body;

  id = parseInt(id as unknown as string, 10);

  try {
    const category = await findCategoryById(id);

    if (!category) {
      return reply.code(404).send({
        message: "Category not found",
      });
    }

    const updatedCategory = await updateCategory(category.id, data);

    return reply.code(200).send(updatedCategory);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function deleteCategoryHandler(
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  let { id } = request.params;

  id = parseInt(id as unknown as string, 10);

  try {
    await deleteCategory(id);

    return reply.code(204).send();
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function getCategoryByIdHandler(
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  let { id } = request.params;

  id = parseInt(id as unknown as string, 10);

  try {
    const category = await findCategoryById(id);

    return reply.code(200).send(category);
  } catch (e) {
    return reply.code(500).send(e);
  }
}
