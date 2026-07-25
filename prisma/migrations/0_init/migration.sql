-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrepot" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "surface" INTEGER NOT NULL,
    "gamme" TEXT NOT NULL,
    "typeMarchandise" TEXT NOT NULL,
    "typeAcces" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrepot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Villa" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "quartier" TEXT NOT NULL,
    "pieces" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "prix" TEXT NOT NULL DEFAULT 'sur demande',
    "photos" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Villa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
