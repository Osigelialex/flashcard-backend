-- AlterTable
ALTER TABLE "FlashCard" ADD COLUMN     "setId" TEXT;

-- CreateTable
CREATE TABLE "FlashCardSet" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashCardSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlashCardSet" ADD CONSTRAINT "FlashCardSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "FlashCardSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
