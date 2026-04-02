-- CreateEnum
CREATE TYPE "DishType" AS ENUM ('VEG', 'NON_VEG');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantDetail" (
    "id" SERIAL NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "contactNumber" TEXT,
    "location" TEXT NOT NULL,
    "weekendWorking" TEXT,
    "weekdaysWorking" TEXT,
    "logo" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "feedbackEnabled" BOOLEAN NOT NULL DEFAULT true,
    "qrEnabled" BOOLEAN NOT NULL DEFAULT false,
    "customerDetailsPopupEnabled" BOOLEAN NOT NULL DEFAULT true,
    "qrScans" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RestaurantDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "DOB" TIMESTAMP(3),
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT,
    "customerId" INTEGER,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantGallery" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "RestaurantGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dishes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL DEFAULT 'no description',
    "type" "DishType" NOT NULL DEFAULT 'VEG',
    "categoryId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DishView" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DishView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQRScan" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "scanDate" DATE NOT NULL,
    "scanCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQRScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantDetail_restaurantName_key" ON "RestaurantDetail"("restaurantName");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantDetail_subdomain_key" ON "RestaurantDetail"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantDetail_userId_key" ON "RestaurantDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobile_restaurantId_key" ON "Customer"("mobile", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQRScan_restaurantId_scanDate_key" ON "DailyQRScan"("restaurantId", "scanDate");

-- AddForeignKey
ALTER TABLE "RestaurantDetail" ADD CONSTRAINT "RestaurantDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantGallery" ADD CONSTRAINT "RestaurantGallery_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishView" ADD CONSTRAINT "DishView_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQRScan" ADD CONSTRAINT "DailyQRScan_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
