import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductInput, ListProductsQuery } from "./product.schema";
import {
  createProduct,
  deleteProduct,
  findProductById,
  getProducts,
  updateProduct,
} from "./product.service";
import { findCategoryById } from "../category/category.service";
import sharp from "sharp";
import {
  fileExists,
  getProductImagePath,
  saveImage,
  unlink,
} from "../../utils/file";
import { MultipartFile } from "@fastify/multipart";

type ProductFormData = {
  name: string;
  categoryId: number;
};

export async function createProductHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parts = request.parts();

  const productData: ProductFormData = { name: "", categoryId: 0 };
  let productPictureBuffer: Buffer | undefined;
  let productPictureFilename = "imageFileName.jpg";

  for await (const part of parts) {
    if (part.file) {
      productPictureBuffer = await part.toBuffer();
      productPictureFilename = `${Date.now()}-${part.filename}`;
      productPictureFilename = productPictureFilename.replace(/\s/g, "");
    } else {
      const fieldName = part.fieldname as keyof ProductFormData;
      // eslint-disable-next-line
      // @ts-ignore
      if (part.fields && typeof part.value === "string") {
        // eslint-disable-next-line
        // @ts-ignore
        productData[fieldName] = part.value;
      }
    }
  }

  if (!productPictureBuffer) {
    return reply.status(400).send({ message: "Image is required" });
  }

  const categoryId = parseInt(productData.categoryId as unknown as string, 10);
  const category = await findCategoryById(categoryId);
  if (!category) {
    return reply.status(404).send({ message: "Category does not exist" });
  }

  const resizedImageBuffer = await sharp(productPictureBuffer)
    .resize(3200, 3200)
    .toBuffer();

  const imageUrl: string = await saveImage(
    resizedImageBuffer,
    `${productPictureFilename}`,
  );

  const finalProductData = {
    ...productData,
    picture: imageUrl,
    categoryId: categoryId,
  };

  try {
    const product = await createProduct(finalProductData);
    return reply.code(201).send(product);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return reply.code(500).send(e.message);
    }
  }
}

export async function getProductsHandler(
  request: FastifyRequest<{
    Querystring: ListProductsQuery;
  }>,
  reply: FastifyReply,
) {
  try {
    const { filterByName, sortBy, sortOrder } = request.query;

    let { page, limit, filterByCategory } = request.query;

    page = parseInt(page as unknown as string, 10) || 1;
    limit = parseInt(limit as unknown as string, 10) || 10;
    filterByCategory = parseInt(filterByCategory as unknown as string, 10);

    const skip: number = (page - 1) * limit;

    const products = await getProducts({
      page: skip,
      limit: limit,
      filterByName: filterByName,
      filterByCategory: filterByCategory,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    return reply.code(200).send(products);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function updateProductHandler(
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id as unknown as string, 10);
  const parts = request.parts();
  const productData: Partial<CreateProductInput> = {};
  let productPictureBuffer: Buffer | null = null;
  let productPictureFilename: string | null = null;

  for await (const part of parts) {
    // Check if part is a file part
    if ((part as MultipartFile).file) {
      const filePart = part as MultipartFile;
      productPictureBuffer = await filePart.toBuffer();
      productPictureFilename = filePart.filename;
    } else {
      // Handle field part
      const fieldName = part.fieldname as keyof Partial<CreateProductInput>;
      // Here, we need to access part.value safely
      // Ensure that part.value exists and is of type string
      if ("value" in part && typeof part["value"] === "string") {
        // eslint-disable-next-line
        // @ts-ignore
        productData[fieldName] = part["value"];
      }
    }
  }

  try {
    const product = await findProductById(id);
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    if (productData.categoryId) {
      productData.categoryId = parseInt(
        productData.categoryId as unknown as string,
        10,
      );

      const category = await findCategoryById(productData.categoryId);
      if (!category) {
        return reply.status(404).send({ message: "Category does not exist" });
      }
    }

    // If a new image is uploaded, resize and save it
    if (productPictureBuffer && productPictureFilename) {
      // remove existing image
      if (product.picture) {
        const imagePath = getProductImagePath(product.picture);

        // Check if image file exists, then delete it
        const exists = await fileExists(imagePath);
        if (exists) {
          await unlink(imagePath);
        }
      }

      const resizedImageBuffer = await sharp(productPictureBuffer)
        .resize(3200, 3200)
        .toBuffer();

      productData.picture = await saveImage(
        resizedImageBuffer,
        `${productPictureFilename}`,
      );
    }

    const updatedProduct = await updateProduct(id, productData);
    return reply.code(200).send(updatedProduct);
  } catch (e) {
    if (e instanceof Error) {
      return reply.code(500).send(e.message);
    }
  }
}

export async function deleteProductHandler(
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  const id = parseInt(request.params.id as unknown as string, 10);

  try {
    const product = await findProductById(id);
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    // If the product has an associated image, delete it
    if (product.picture) {
      const imagePath = getProductImagePath(product.picture); // Implement this function
      await unlink(imagePath);
    }

    await deleteProduct(id);
    return reply.code(204).send();
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function getProductByIdHandler(
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) {
  let { id } = request.params;

  id = parseInt(id as unknown as string, 10);

  try {
    const product = await findProductById(id);

    return reply.code(200).send(product);
  } catch (e) {
    return reply.code(500).send(e);
  }
}
