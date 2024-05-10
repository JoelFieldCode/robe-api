-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image_url" VARCHAR(250) NOT NULL,
    "user_id" VARCHAR(150) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
