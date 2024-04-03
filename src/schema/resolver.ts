import { Category, Resolvers } from '../gql/server/resolvers-types'
import { prisma } from '../database/prismaClient'
import { getUserCategory } from '../services/category';

/*
  TODO swap all GQL types to camel case
*/
export const resolver: Resolvers = {
  Query: {
    getCategories: async (_parent, _query, { req }) => {
      const categories = await prisma.category.findMany({
        include: { _count: { select: { items: true } } },
        where: {
          user_id: req.context.user_id,
        }
      })

      return categories.map(({ _count, ...rest }) => ({
        ...rest,
        itemCount: _count.items
      }))
    },
    getCategory: async (_parent, { categoryId }, { req }) => {
      const { _count, ...rest } = await prisma.category.findFirstOrThrow({
        include: { _count: { select: { items: true } } },
        where: {
          id: categoryId,
          user_id: req.context.user_id,
        }
      })
      return {
        ...rest,
        itemCount: _count.items
      }

    },
  },
  Category: {
    // this is technically a N+1 bug but only if FE requests all categories with all items
    // we should validate to make sure you can't do this
    items: async (category: Category) => {
      // don't need to check user_id here as this should already be checked by parent resolver
      return await prisma.item.findMany({ where: { categoryId: category.id } })
    },
  },
  Mutation: {
    createCategory: async (_parent, { input }, { req }) => {
      const { name, image_url } = input
      const category = await prisma.category.create({ data: { name, image_url, user_id: req.context.user_id } })

      return {
        ...category,
        // not possible to create an item without a category
        itemCount: 0,
      }
    },
    createItem: async (_parent, { input }, { req }) => {
      const { name, image_url, url, price, categoryId } = input
      // should move to middleware?
      const category = await getUserCategory(req, categoryId)
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
