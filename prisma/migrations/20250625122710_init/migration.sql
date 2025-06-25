/*
  Warnings:

  - You are about to drop the column `post_id` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `destination_at` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `destination_point` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `post_id_arrival` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id_departure` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrival_at` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrival_point` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_price` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_url` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax_price` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "post_id",
ADD COLUMN     "post_id_arrival" INTEGER NOT NULL,
ADD COLUMN     "post_id_departure" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "cost",
DROP COLUMN "destination_at",
DROP COLUMN "destination_point",
ADD COLUMN     "arrival_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "arrival_point" TEXT NOT NULL,
ADD COLUMN     "base_price" INTEGER NOT NULL,
ADD COLUMN     "logo_url" TEXT NOT NULL,
ADD COLUMN     "tax_price" INTEGER NOT NULL,
ADD COLUMN     "total_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_FavoriteToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavoriteToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FavoriteToPost_B_index" ON "_FavoriteToPost"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_post_id_departure_fkey" FOREIGN KEY ("post_id_departure") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_post_id_arrival_fkey" FOREIGN KEY ("post_id_arrival") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteToPost" ADD CONSTRAINT "_FavoriteToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteToPost" ADD CONSTRAINT "_FavoriteToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
