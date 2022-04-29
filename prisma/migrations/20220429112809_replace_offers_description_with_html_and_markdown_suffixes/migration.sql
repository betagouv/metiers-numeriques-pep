/*
  Warnings:

  - You are about to drop the column `missionDescription` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `profileDescription` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `teamDescription` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `missionDescriptionAsHtml` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missionDescriptionAsMarkdown` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamDescriptionAsHtml` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamDescriptionAsMarkdown` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "missionDescription",
DROP COLUMN "profileDescription",
DROP COLUMN "teamDescription",
ADD COLUMN     "missionDescriptionAsHtml" TEXT NOT NULL,
ADD COLUMN     "missionDescriptionAsMarkdown" TEXT NOT NULL,
ADD COLUMN     "profileDescriptionAsHtml" TEXT,
ADD COLUMN     "profileDescriptionAsMarkdown" TEXT,
ADD COLUMN     "teamDescriptionAsHtml" TEXT NOT NULL,
ADD COLUMN     "teamDescriptionAsMarkdown" TEXT NOT NULL;
