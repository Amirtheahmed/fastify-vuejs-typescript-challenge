import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  return prisma.user.create({
    // eslint-disable-next-line
    // @ts-ignore
    data: { salt: salt, password: hash, ...rest },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
