import { GraphQLError } from "graphql";
import { prisma } from "../../database/prismaClient";

export const assertUserOwnsCategory = async (userId: string, categoryId: number) => {
  const category = await prisma.category.findUniqueOrThrow({
    include: { _count: { select: { items: true } } },
    where: {
      id: categoryId,
    },
  })

  if (category.userId !== userId) {
    throw new GraphQLError("Unauthorised", {
      extensions: {
        code: "UNAUTHORISED",
        http: { status: 403 },
      },
    });
  }

  return category;

};

export const assertUserOwnsItem = async (userId: string, itemId: number) => {
  const item = await prisma.item.findUniqueOrThrow({
    where: {
      id: itemId,
    },
  })

  if (item.userId !== userId) {
    throw new GraphQLError("Unauthorised", {
      extensions: {
        code: "UNAUTHORISED",
        http: { status: 403 },
      },
    });
  }

  return item;
};
