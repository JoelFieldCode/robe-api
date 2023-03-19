import { PrismaClient } from '@prisma/client'
import { Request } from 'express'
import { QueryGetCategoryArgs, QueryGetCategoryItemsArgs, MutationCreateCategoryArgs, MutationCreateItemArgs } from '../types/generated'

const prisma = new PrismaClient()

// TODO get full resolver/context/parent types working from codegen?
export const resolver = {
  Query: {
    getCategories: async (_args: void, req: Request) => {
      return await prisma.category.findMany({
        where: {
          user_id: req.context.user_id,
        }
      })
    },
    getCategory: async ({ categoryId }: QueryGetCategoryArgs, req: Request) => {
      return await prisma.category.findFirstOrThrow({
        where: {
          id: categoryId,
          user_id: req.context.user_id,
        }
      })
    },
    getCategoryItems: async ({ categoryId }: QueryGetCategoryItemsArgs, req: Request) => {
      return await prisma.item.findMany({
        where: {
          categoryId,
          user_id: req.context.user_id,
        }
      })
    },
  },
  Mutation: {
    createCategory: async ({ input }: MutationCreateCategoryArgs, req: Request) => {
      const { name, image_url } = input
      return await prisma.category.create({ data: { name, image_url, user_id: req.context.user_id } })
    },
    createItem: async ({ input }: MutationCreateItemArgs, req: Request) => {
      const { name, image_url, url, price, category_id } = input
      // validate this user owns the category
      await prisma.category.findFirstOrThrow({
        where: {
          user_id: req.context.user_id,
          id: category_id,
        }
      })
      return await prisma.item.create({ data: { categoryId: category_id, name, image_url, url, price, user_id: req.context.user_id } })
    }
  }
};
