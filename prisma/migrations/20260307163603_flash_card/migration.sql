-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('term', 'qa');

-- CreateEnum
CREATE TYPE "BloomLevel" AS ENUM ('recall', 'comprehension', 'application', 'analysis');

-- CreateTable
CREATE TABLE "FlashCard" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "bloomLevel" "BloomLevel" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlashCard" ADD CONSTRAINT "FlashCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
