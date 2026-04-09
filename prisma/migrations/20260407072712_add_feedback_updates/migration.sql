-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PARTIAL', 'COMPLETE');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "customerContact" TEXT,
ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT 'PARTIAL';
