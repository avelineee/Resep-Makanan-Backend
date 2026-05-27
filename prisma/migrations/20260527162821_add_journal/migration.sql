-- CreateTable
CREATE TABLE `Journal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `weekStart` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Journal_userId_weekStart_key`(`userId`, `weekStart`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `journalId` INTEGER NOT NULL,
    `recipeId` INTEGER NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `mealType` ENUM('BREAKFAST', 'LUNCH', 'DINNER') NOT NULL,

    UNIQUE INDEX `JournalEntry_journalId_dayOfWeek_mealType_key`(`journalId`, `dayOfWeek`, `mealType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
