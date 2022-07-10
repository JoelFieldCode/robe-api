/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "image_url" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "user_id" VARCHAR(150) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
