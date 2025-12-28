-- Add customer details popup toggle to RestaurantDetail
ALTER TABLE "RestaurantDetail"
ADD COLUMN "customerDetailsPopupEnabled" BOOLEAN NOT NULL DEFAULT TRUE;

