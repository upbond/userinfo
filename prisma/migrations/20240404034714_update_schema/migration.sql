/*
  Warnings:

  - You are about to drop the column `birth_day` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birth_month` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birth_year` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `birth_day`,
    DROP COLUMN `birth_month`,
    DROP COLUMN `birth_year`,
    DROP COLUMN `city`,
    DROP COLUMN `picture`,
    DROP COLUMN `postal_code`,
    ADD COLUMN `day_of_birth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `education_level` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `first_name_kana` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `last_name_kana` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `month_of_birth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `photo` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `year_of_birth` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `zip` VARCHAR(191) NOT NULL DEFAULT '';
