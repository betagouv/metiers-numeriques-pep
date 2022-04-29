-- CreateEnum
CREATE TYPE "OfferIndexStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED');

-- AlterTable
ALTER TABLE "OfferIndex" ADD COLUMN     "status" "OfferIndexStatus" NOT NULL DEFAULT E'PENDING';
