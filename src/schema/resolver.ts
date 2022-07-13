import { PrismaClient } from '@prisma/client'
import { Request } from 'express'

const prisma = new PrismaClient()

type GetCategoryQuery = { categoryId: number }

export const resolver = {
  getCategories: async (args: {}, req: Request) => {
    return await prisma.category.findMany({
      where: {
        user_id: req.context.user_id,
      }
    })
  },
  getCategory: async ({ categoryId }: GetCategoryQuery, req: Request) => {
    return await prisma.category.findFirst({
      where: {
        id: categoryId,
        user_id: req.context.user_id,
      }
    })
  }
};
