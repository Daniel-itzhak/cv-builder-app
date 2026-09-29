-- CreateEnum
CREATE TYPE "RejectionReason" AS ENUM (
  'AUTO_REJECT',
  'POST_HR_SCREEN',
  'POST_TECH_ASSESSMENT',
  'POST_TECH_INTERVIEW',
  'CULTURE_FIT_FINAL_ROUND',
  'POSITION_CANCELLED',
  'COMPENSATION_MISMATCH',
  'ROLE_CHANGED',
  'WITHDREW',
  'OTHER'
);

-- Preserve existing free-text reasons as notes before converting the column.
ALTER TABLE "job_applications" ADD COLUMN "rejectionNotes" TEXT;

UPDATE "job_applications"
SET "rejectionNotes" = NULLIF(BTRIM("rejectionReason"), '')
WHERE "rejectionReason" IS NOT NULL
  AND "rejectionReason" NOT IN (
    'AUTO_REJECT',
    'POST_HR_SCREEN',
    'POST_TECH_ASSESSMENT',
    'POST_TECH_INTERVIEW',
    'CULTURE_FIT_FINAL_ROUND',
    'POSITION_CANCELLED',
    'COMPENSATION_MISMATCH',
    'ROLE_CHANGED',
    'WITHDREW',
    'OTHER'
  );

-- Convert TEXT -> enum without dropping the column. Unknown/null values become OTHER
-- so existing rows never violate the new NOT NULL + enum constraints.
ALTER TABLE "job_applications"
  ALTER COLUMN "rejectionReason" DROP DEFAULT;

ALTER TABLE "job_applications"
  ALTER COLUMN "rejectionReason" TYPE "RejectionReason"
  USING (
    CASE
      WHEN "rejectionReason" IN (
        'AUTO_REJECT',
        'POST_HR_SCREEN',
        'POST_TECH_ASSESSMENT',
        'POST_TECH_INTERVIEW',
        'CULTURE_FIT_FINAL_ROUND',
        'POSITION_CANCELLED',
        'COMPENSATION_MISMATCH',
        'ROLE_CHANGED',
        'WITHDREW',
        'OTHER'
      ) THEN "rejectionReason"::"RejectionReason"
      ELSE 'OTHER'::"RejectionReason"
    END
  );

ALTER TABLE "job_applications"
  ALTER COLUMN "rejectionReason" SET DEFAULT 'OTHER'::"RejectionReason",
  ALTER COLUMN "rejectionReason" SET NOT NULL;
