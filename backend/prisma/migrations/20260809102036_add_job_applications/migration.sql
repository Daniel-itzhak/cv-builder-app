-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEWING', 'REJECTED', 'OFFER');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED');

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SAVED',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_stages" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "stageDate" TIMESTAMP(3) NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_stages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_applications_userId_idx" ON "job_applications"("userId");

-- CreateIndex
CREATE INDEX "job_applications_cvId_idx" ON "job_applications"("cvId");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "application_stages_applicationId_idx" ON "application_stages"("applicationId");

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_stages" ADD CONSTRAINT "application_stages_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
