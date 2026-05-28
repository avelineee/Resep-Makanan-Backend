-- CreateTable
CREATE TABLE "UserTutorialAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tutorialId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "UserTutorialAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTutorialAccess_transactionId_key" ON "UserTutorialAccess"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTutorialAccess_userId_tutorialId_key" ON "UserTutorialAccess"("userId", "tutorialId");

-- AddForeignKey
ALTER TABLE "UserTutorialAccess" ADD CONSTRAINT "UserTutorialAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTutorialAccess" ADD CONSTRAINT "UserTutorialAccess_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTutorialAccess" ADD CONSTRAINT "UserTutorialAccess_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
