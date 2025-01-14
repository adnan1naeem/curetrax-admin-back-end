-- CreateTable
CREATE TABLE "Home" (
    "id" SERIAL NOT NULL,
    "heading" TEXT DEFAULT 'null',
    "description" TEXT DEFAULT 'null',
    "image" TEXT DEFAULT 'null',
    "button" TEXT DEFAULT 'null',
    "link" TEXT DEFAULT 'null',
    "section" TEXT DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timeline" (
    "id" SERIAL NOT NULL,
    "heading" TEXT DEFAULT 'null',
    "description" TEXT DEFAULT 'null',
    "date" TIMESTAMP(3),
    "image" TEXT DEFAULT 'null',
    "section" TEXT DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "heading" TEXT DEFAULT 'null',
    "description" TEXT DEFAULT 'null',
    "section" TEXT DEFAULT 'null',
    "pagename" TEXT NOT NULL DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCareProvider" (
    "id" SERIAL NOT NULL,
    "description" TEXT DEFAULT 'null',
    "section" TEXT DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "HealthCareProvider_pkey" PRIMARY KEY ("id")
);
