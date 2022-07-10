import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// The root provides a resolver function for each API endpoint
export const resolver = {
  categories: async () => {
    return await prisma.category.findMany()
  },
};
