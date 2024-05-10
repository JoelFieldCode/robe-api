-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
