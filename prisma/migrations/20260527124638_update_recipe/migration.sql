/*
  Warnings:

  - Added the required column `calories` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servings` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe` ADD COLUMN `calories` INTEGER NOT NULL,
    ADD COLUMN `cookTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `prepTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `servings` INTEGER NOT NULL;
