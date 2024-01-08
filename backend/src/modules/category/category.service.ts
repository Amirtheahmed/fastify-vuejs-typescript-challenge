import prisma from "../../utils/prisma";
import { CreateCategoryInput, ListCategoriesQuery } from "./category.schema";

export async function createCategory(inputData: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      name: inputData.name,
      parentId: inputData.parentId ?? null,
    },
  });
}

export async function getCategories(params: ListCategoriesQuery) {
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

  return prisma.category.findMany({
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
}

export async function updateCategory(
  id: number,
  updateData: Partial<CreateCategoryInput>,
) {
  return prisma.category.update({
    where: { id: id },
    data: {
      name: updateData.name,
      parentId: updateData.parentId ?? null,
    },
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: { id },
  });
}

export async function findCategoryById(id: number) {
  return prisma.category.findUnique({
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
}
