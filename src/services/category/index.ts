import { prisma } from "../../database/prismaClient";

// validate this user owns the category
export const getUserCategory = async (userId: string, categoryId: number) => {
  return await prisma.category.findFirstOrThrow({
    where: {
      user_id: userId,
      id: categoryId,
    },
  });
};
