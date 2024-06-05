/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `address` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `Json`.
  - You are about to alter the column `custom_data` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `Json`.
  - You are about to alter the column `driver_license` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `family_members` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `Json`.
  - You are about to alter the column `housing_loan` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `identities` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `Json`.
  - You are about to alter the column `marital_status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `address` JSON NULL,
    MODIFY `custom_data` JSON NULL,
    MODIFY `driver_license` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `family_members` JSON NULL,
    MODIFY `housing_loan` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `identities` JSON NULL,
    MODIFY `marital_status` BOOLEAN NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`id`);
