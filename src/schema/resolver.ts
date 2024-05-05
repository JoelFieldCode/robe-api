import { v4 } from "uuid";
import { prisma } from "../database/prismaClient";
import { Category, Resolvers } from "../gql/server/resolvers-types";
import { getUserCategory } from "../services/category";
import { getUserSession } from "../utils/getUserSession";

/*
  TODO swap all GQL types to camel case
*/
export const resolver: Resolvers = {
  Query: {
    getCategories: async (_parent, _query, { req, res }) => {
      const userId = await getUserSession(req, res);

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
      const userId = await getUserSession(req, res);

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
    /*
      Should rate limit this mutation too.. but since you can't sign up yet it's ok.
    */
    uploadImage: async (_parent, { image }, { req, res }) => {
      await getUserSession(req, res);
      // TODO we aren't really converting it to webp yet
      const path = `images/${v4()}.webp`;
      const uploadFileUrl = new URL(
        `/${process.env.BUNNYCDN_STORAGE_ZONE}/${path}`,
        `https://${process.env.BUNNY_STORAGE_API_HOST}`,
      );

      try {
        const fileArrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(fileArrayBuffer);
        const bunnyUploadFileRes = await fetch(uploadFileUrl, {
          method: "PUT",
          headers: {
            "AccessKey": process.env.BUNNYCDN_API_KEY,
            "Content-Type": "application/octet-stream",
          },
          body: buffer,
        });

        if (!bunnyUploadFileRes.ok) {
          throw new Error("File upload failed");
        }
        return `${process.env.BUNNYCDN_HOST}/${path}`;
      } catch (err) {
        throw new Error(err);
      }

    },
    createCategory: async (_parent, { input }, { req, res }) => {
      const { name, image_url } = input;
      const userId = await getUserSession(req, res);
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
      const userId = await getUserSession(req, res);
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
    deleteCategory: async (_parent, { categoryId }, { req, res }) => {
      const userId = await getUserSession(req, res);
      const category = await getUserCategory(userId, categoryId);
      await prisma.category.delete({
        where: {
          id: category.id,
        },
      });
      return "Success";
    },
    deleteItem: async (_parent, { itemId }, { req, res }) => {
      const userId = await getUserSession(req, res);
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
