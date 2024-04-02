import { Category, Resolvers } from '../gql/server/resolvers-types'
import { prisma } from '../database/prismaClient'
import { getUserCategory } from '../services/category';

export const resolver: Resolvers = {
  Query: {
    getCategories: async (_parent, query, { req }) => {
      return await prisma.category.findMany({
        where: {
          user_id: req.context.user_id,
        }
      })
    },
    getCategory: async (_parent, { categoryId }, { req }) => {
      return await prisma.category.findFirstOrThrow({
        include: { items: true },
        where: {
          id: categoryId,
          user_id: req.context.user_id,
        }
      })
    },
  },
  Category: {
    items(category: Category) {
      return category.items
    }
  },
  Mutation: {
    createCategory: async (_parent, { input }, { req }) => {
      const { name, image_url } = input
      return await prisma.category.create({ data: { name, image_url, user_id: req.context.user_id } })
    },
    createItem: async (_parent, { input }, { req }) => {
      const { name, image_url, url, price, category_id } = input
      // should move to middleware?
      const category = await getUserCategory(req, category_id)
      return await prisma.item.create({ data: { categoryId: category.id, name, image_url, url, price, user_id: req.context.user_id } })
    },
    deleteCategory: async (parent, { categoryId }, { req }) => {
      // should move to middleware?
      const category = await getUserCategory(req, categoryId)
      await prisma.category.delete({
        where: {
          id: category.id,
        }
      })
      return 'Success'
    },
    deleteItem: async (_parent, { itemId }, { req }) => {
      // user id matches item, allow deletion
      await prisma.item.findFirstOrThrow({ where: { id: itemId, user_id: req.context.user_id } })
      await prisma.item.delete({
        where: {
          id: itemId,
        }
      })
      return 'Success'
    }
  }
};
