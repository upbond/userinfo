-- CreateTable
CREATE TABLE `event-log` (
    `id` VARCHAR(191) NOT NULL,
    `sub` VARCHAR(191) NOT NULL DEFAULT '',
    `data` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `event_type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `retry` INTEGER NOT NULL DEFAULT 0,
    `errors` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client-credential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(191) NOT NULL,
    `client_secret` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
