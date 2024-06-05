-- DropIndex
DROP INDEX `User_wallet_address_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `wallet_address` VARCHAR(191) NOT NULL DEFAULT '';
