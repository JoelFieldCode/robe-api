import { GraphQLError } from "graphql";
import { prisma } from "../../database/prismaClient";

export const assertUserOwnsCategory = async (userId: string, categoryId: number) => {
  const userCategories = await prisma.user.findUnique({ where: { id: userId } }).categories();
  if (!userCategories.find((category) => category.id === categoryId)) {
    throw new GraphQLError("Unauthorised", {
      extensions: {
        code: "UNAUTHORISED",
        http: { status: 403 },
      },
    });
  }
};

export const assertUserOwnsItem = async (userId: string, itemId: number) => {
  const userItems = await prisma.user.findUnique({ where: { id: userId } }).items();
  if (!userItems.find((item) => item.id === itemId)) {
    throw new GraphQLError("Unauthorised", {
      extensions: {
        code: "UNAUTHORISED",
        http: { status: 403 },
      },
    });
  }
};
