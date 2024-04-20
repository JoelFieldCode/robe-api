import { Request } from "express";
import { prisma } from "../../database/prismaClient";

// validate this user owns the category
export const getUserCategory = async (req: Request, categoryId: number) => {
  return await prisma.category.findFirstOrThrow({
    where: {
      user_id: req.context.user_id,
      id: categoryId,
    },
  });
};
