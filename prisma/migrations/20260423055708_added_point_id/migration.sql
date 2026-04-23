-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "selectedPointIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "selectedPoints" TEXT[] DEFAULT ARRAY[]::TEXT[];
