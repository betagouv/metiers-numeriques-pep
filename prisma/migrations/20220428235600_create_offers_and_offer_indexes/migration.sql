-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" JSONB,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "missionDescription" TEXT NOT NULL,
    "professionLabel" TEXT NOT NULL,
    "profileDescription" TEXT,
    "recruiterName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "teamDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferIndex" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_sourceUrl_key" ON "Offer"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "OfferIndex_sourceUrl_key" ON "OfferIndex"("sourceUrl");
