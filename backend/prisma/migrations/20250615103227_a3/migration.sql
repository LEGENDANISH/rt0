/*
  Warnings:

  - You are about to drop the column `orignalprice` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalprice` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "orignalprice",
ADD COLUMN     "originalprice" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");
