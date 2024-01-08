import prisma from "../../utils/prisma";
import { CreateProductInput, ListProductsQuery } from "./product.schema";

export async function createProduct(inputData: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: inputData.name,
      picture: inputData.picture,
      categoryId: inputData.categoryId,
    },
    include: {
      category: true,
    },
  });
}

export async function getProducts(params: ListProductsQuery) {
  // Construct where object conditionally based on filters
  const where = {
    ...(params.filterByName && {
      name: {
        contains: params.filterByName,
      },
    }),
    ...(params.filterByCategory && {
      categoryId: {
        equals: params.filterByCategory,
      },
    }),
  };

  const orderBy = {
    [params.sortBy]: params.sortOrder,
  };

  return prisma.product.findMany({
    skip: params.page,
    take: params.limit,
    where: where,
    orderBy: orderBy,
    include: {
      category: true,
    },
  });
}

export async function updateProduct(
  id: number,
  updateData: Partial<CreateProductInput>,
) {
  return prisma.product.update({
    where: { id: id },
    data: {
      name: updateData.name,
      picture: updateData.picture,
      categoryId: updateData.categoryId,
    },
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function findProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      picture: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,

      category: {
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
