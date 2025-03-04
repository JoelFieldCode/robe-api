/*
  Warnings:

  - You are about to drop the column `user_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `items` table. All the data in the column will be lost.
  - Made the column `userId` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_userId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "user_id",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "user_id",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
