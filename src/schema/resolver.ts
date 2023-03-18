import { PrismaClient } from '@prisma/client'
import { Request } from 'express'

const prisma = new PrismaClient()

type GetCategoryQuery = { categoryId: number }

type CreateCategoryMutation = {
  input: {
    name: string,
    image_url: string
  }
}

type CreateItemMutation = {
  input: {
    category_id: number,
    name: string,
    image_url: string
    url: string,
    price: number
  }
}

export const resolver = {
  getCategories: async (_args: {}, req: Request) => {
    return await prisma.category.findMany({
      where: {
        user_id: req.context.user_id,
      }
    })
  },
  getCategory: async ({ categoryId }: GetCategoryQuery, req: Request) => {
    return await prisma.category.findFirstOrThrow({
      where: {
        id: categoryId,
        user_id: req.context.user_id,
      }
    })
  },
  getCategoryItems: async ({ categoryId }: GetCategoryQuery, req: Request) => {
    return await prisma.item.findMany({
      where: {
        categoryId,
        user_id: req.context.user_id,
      }
    })
  },
  createCategory: async ({ input }: CreateCategoryMutation, req: Request) => {
    const { name, image_url } = input
    return await prisma.category.create({ data: { name, image_url, user_id: req.context.user_id } })
  },
  createItem: async ({ input }: CreateItemMutation, req: Request) => {
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
};
