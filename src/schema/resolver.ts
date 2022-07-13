import { PrismaClient } from '@prisma/client'
import { Request } from 'express'

const prisma = new PrismaClient()

// The root provides a resolver function for each API endpoint
export const resolver = {
  categories: async (args: any, req: Request) => {
    return await prisma.category.findMany({
      where: {
        user_id: req.context.user_id,
      }
    })
  },
};
