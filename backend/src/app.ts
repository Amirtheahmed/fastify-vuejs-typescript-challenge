import Fastify from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { categorySchemas } from "./modules/category/category.schema";
import categoryRoutes from "./modules/category/category.route";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import fastifyMultipart from "@fastify/multipart";
import path from "path";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

// eslint-disable-next-line
// @ts-ignore
global.__basedir = path.resolve();

export const server = Fastify();

const swaggerOptions = {
  swagger: {
    info: {
      title: "Fastify VueJs App Rest Api",
      description: "Fastify based REST API challenge",
      version: "1.0.0",
    },
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

server.register(fastifySwagger, swaggerOptions);
server.register(fastifySwaggerUi, swaggerUiOptions);
server.register(fastifyMultipart);
server.register(cors, {
  origin: ["https://fastify-vuejs-app.amirtheahmed.dev"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Content-Type",
    "Authorization",
  ],
});
server.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/uploads",
});

server.get("/healthcheck", async function () {
  return {
    status: "OK",
  };
});

// register schemas
for (const schema of [...userSchemas, ...categorySchemas, ...productSchemas]) {
  server.addSchema(schema);
}

server.register(userRoutes, { prefix: "api/users" });
server.register(categoryRoutes, { prefix: "api/categories" });
server.register(productRoutes, { prefix: "api/products" });
async function main() {
  try {
    server.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
      if (err) throw err;
    });

    console.log("Server ready at http://localhost:3000");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
