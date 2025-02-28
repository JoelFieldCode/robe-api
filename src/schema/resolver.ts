import { GraphQLError } from "graphql";
import { v4 } from "uuid";
import { z, ZodError } from "zod";
import { prisma } from "../database/prismaClient";
import { Category, Resolvers } from "../gql/server/resolvers-types";
import {
  assertUserOwnsCategory,
  assertUserOwnsItem,
} from "../services/category";
import { getUserSession } from "../utils/getUserSession";

const createItemSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Item name must not be longer than 100 characters" }),
  price: z.number(),
  image_url: z.string().url().optional().nullable(),
  url: z.string().url(),
  categoryId: z.number(),
});

const updateItemSchema = createItemSchema.extend({
  id: z.number(),
});

const createCategorySchema = z.object({
  name: z.string().max(50, {
    message: "Category name must not be longer than 100 characters",
  }),
});

const updateCategorySchema = createCategorySchema.extend({
  id: z.number(),
});

/*
  TODO swap all GQL types to camel case
*/
export const resolver: Resolvers = {
  Query: {
    getCategories: async (_parent, _query, { req, res }) => {
      const user = await getUserSession(req, res);
      const categories = await prisma.user
        .findUnique({ where: { id: user.id } })
        .categories({
          include: { _count: { select: { items: true } } },
          orderBy: {
            updated_at: "desc",
          },
        });

      return categories.map(({ _count, ...rest }) => ({
        ...rest,
        itemCount: _count.items,
      }));
    },
    getCategory: async (_parent, { categoryId }, { req, res }) => {
      const user = await getUserSession(req, res);
      const category = await assertUserOwnsCategory(user.id, categoryId);
      const { _count, ...rest } = category;

      return {
        ...rest,
        itemCount: _count.items,
      };
    },
    getItem: async (_parent, { itemId }, { req, res }) => {
      const user = await getUserSession(req, res);
      const item = await assertUserOwnsItem(user.id, itemId);

      return item;
    },
  },
  Category: {
    items: async (category: Category) => {
      // don't need to check user_id here as this should already be checked by parent resolver
      return await prisma.category
        .findUnique({ where: { id: category.id } })
        .items({
          orderBy: { updated_at: "desc" },
        });
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
      const baseUrl = `${process.env.BUNNY_STORAGE_API_HOST}/${process.env.BUNNYCDN_STORAGE_ZONE}/${path}`

      try {
        const fileArrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(fileArrayBuffer);
        const bunnyUploadFileRes = await fetch(baseUrl, {
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
      try {
        const { name } = createCategorySchema.parse(input);
        const user = await getUserSession(req, res);
        const category = await prisma.category.create({
          data: { name, userId: user.id },
        });

        return {
          ...category,
          // not possible to create an item without a category
          itemCount: 0,
        };
      } catch (err) {
        if (err instanceof ZodError) {
          const errorMeta = err.errors[0];
          return Promise.reject(new GraphQLError(`${errorMeta.message}`));
        } else {
          return Promise.reject(err);
        }
      }
    },
    updateCategory: async (_parent, { input }, { req, res }) => {
      try {
        const { name, id } = updateCategorySchema.parse(input);
        const user = await getUserSession(req, res);
        await assertUserOwnsCategory(user.id, id);

        const { _count, ...updatedCategory } = await prisma.category.update({
          where: { id },
          data: { name },
          include: { _count: { select: { items: true } } },
        });

        return {
          ...updatedCategory,
          itemCount: _count.items,
        };
      } catch (err) {
        if (err instanceof ZodError) {
          const errorMeta = err.errors[0];
          return Promise.reject(new GraphQLError(`${errorMeta.message}`));
        } else {
          return Promise.reject(err);
        }
      }
    },
    createItem: async (_parent, { input }, { req, res }) => {
      try {
        const { name, image_url, url, price, categoryId } =
          createItemSchema.parse(input);
        const user = await getUserSession(req, res);
        await assertUserOwnsCategory(user.id, categoryId);

        // bump category timestamp when adding an item
        // also update the latest image URL
        await prisma.category.update({
          where: { id: categoryId },
          data: { updated_at: new Date(), image_url },
        });

        return await prisma.item.create({
          data: {
            categoryId,
            name,
            image_url,
            url,
            price,
            userId: user.id,
          },
        });
      } catch (err) {
        if (err instanceof ZodError) {
          const errorMeta = err.errors[0];
          return Promise.reject(new GraphQLError(`${errorMeta.message}`));
        } else {
          return Promise.reject(err);
        }
      }
    },
    updateItem: async (_parent, { input }, { req, res }) => {
      try {
        const { name, id, image_url, url, price, categoryId } =
          updateItemSchema.parse(input);
        const user = await getUserSession(req, res);
        await Promise.all([
          assertUserOwnsCategory(user.id, categoryId),
          assertUserOwnsItem(user.id, id),
        ]);

        // bump category timestamp when adding an item
        // also update the latest image URL
        await prisma.category.update({
          where: { id: categoryId },
          data: { updated_at: new Date(), image_url },
        });

        return await prisma.item.update({
          where: {
            id,
          },
          data: {
            categoryId,
            name,
            image_url,
            url,
            price,
            userId: user.id,
          },
        });
      } catch (err) {
        if (err instanceof ZodError) {
          const errorMeta = err.errors[0];
          return Promise.reject(new GraphQLError(`${errorMeta.message}`));
        } else {
          return Promise.reject(err);
        }
      }
    },
    deleteCategory: async (_parent, { categoryId }, { req, res }) => {
      const user = await getUserSession(req, res);
      await assertUserOwnsCategory(user.id, categoryId);

      await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return "Success";
    },
    deleteItem: async (_parent, { itemId }, { req, res }) => {
      const user = await getUserSession(req, res);
      await assertUserOwnsItem(user.id, itemId);

      await prisma.item.delete({
        where: {
          id: itemId,
        },
      });
      return "Success";
    },
  },
};
