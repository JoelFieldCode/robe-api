import { PrismaClient } from '@prisma/client'
import { Resolvers } from '../gql/server/resolvers-types'

const prisma = new PrismaClient()

export const resolver: Resolvers = {
  Query: {
    getCategories: async (parent, query, { req }) => {
      return await prisma.category.findMany({
        where: {
          user_id: req.context.user_id,
        }
      })
    },
    getCategory: async (parent, { categoryId }, { req }) => {
      return await prisma.category.findFirstOrThrow({
        where: {
          id: categoryId,
          user_id: req.context.user_id,
        }
      })
    },
    getCategoryItems: async (parent, { categoryId }, { req }) => {
      return await prisma.item.findMany({
        where: {
          categoryId,
          user_id: req.context.user_id,
        }
      })
    },
  },
  Mutation: {
    createCategory: async (parent, { input }, { req }) => {
      const { name, image_url } = input
      return await prisma.category.create({ data: { name, image_url, user_id: req.context.user_id } })
    },
    createItem: async (parent, { input }, { req }) => {
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
