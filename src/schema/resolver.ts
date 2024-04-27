import { prisma } from "../database/prismaClient";
import { Category, Resolvers } from "../gql/server/resolvers-types";
import { getUserCategory } from "../services/category";
import Session from "supertokens-node/recipe/session";

/*
  TODO swap all GQL types to camel case
*/
export const resolver: Resolvers = {
  Query: {
    getCategories: async (_parent, _query, { req, res }) => {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();

      const categories = await prisma.category.findMany({
        include: { _count: { select: { items: true } } },
        where: {
          user_id: userId
        },
      });

      return categories.map(({ _count, ...rest }) => ({
        ...rest,
        itemCount: _count.items,
      }));
    },
    getCategory: async (_parent, { categoryId }, { req, res }) => {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();

      const { _count, ...rest } = await prisma.category.findFirstOrThrow({
        include: { _count: { select: { items: true } } },
        where: {
          id: categoryId,
          user_id: userId,
        },
      });
      return {
        ...rest,
        itemCount: _count.items,
      };
    },
  },
  Category: {
    // this is technically a N+1 bug but only if FE requests all categories with all items
    // we should validate to make sure you can't do this
    items: async (category: Category) => {
      // don't need to check user_id here as this should already be checked by parent resolver
      return await prisma.item.findMany({ where: { categoryId: category.id } });
    },
  },
  Mutation: {
    createCategory: async (_parent, { input }, { req, res }) => {
      const { name, image_url } = input;
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();
      const category = await prisma.category.create({
        data: { name, image_url, user_id: userId, },
      });

      return {
        ...category,
        // not possible to create an item without a category
        itemCount: 0,
      };
    },
    createItem: async (_parent, { input }, { req, res }) => {
      const { name, image_url, url, price, categoryId } = input;
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();
      const category = await getUserCategory(userId, categoryId);

      return await prisma.item.create({
        data: {
          categoryId: category.id,
          name,
          image_url,
          url,
          price,
          user_id: userId,
        },
      });
    },
    deleteCategory: async (parent, { categoryId }, { req, res }) => {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();
      const category = await getUserCategory(userId, categoryId);
      await prisma.category.delete({
        where: {
          id: category.id,
        },
      });
      return "Success";
    },
    deleteItem: async (_parent, { itemId }, { req, res }) => {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();
      // user id matches item, allow deletion
      await prisma.item.findFirstOrThrow({
        where: { id: itemId, user_id: userId, },
      });
      await prisma.item.delete({
        where: {
          id: itemId,
        },
      });
      return "Success";
    },
  },
};
