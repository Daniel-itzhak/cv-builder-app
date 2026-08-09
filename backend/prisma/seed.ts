import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sidebarClassicFormat } from "./formats/sidebar-classic";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@folio.app";
const DEMO_PASSWORD = "password123";

async function main() {
  const format = await prisma.cvFormat.upsert({
    where: { id: "fmt_sidebar_classic" },
    update: {
      name: sidebarClassicFormat.name,
      layoutConfig: sidebarClassicFormat.layoutConfig as Prisma.InputJsonValue,
      thumbnailSchema:
        sidebarClassicFormat.thumbnailSchema as Prisma.InputJsonValue,
      isActive: sidebarClassicFormat.isActive,
    },
    create: {
      id: "fmt_sidebar_classic",
      name: sidebarClassicFormat.name,
      layoutConfig: sidebarClassicFormat.layoutConfig as Prisma.InputJsonValue,
      thumbnailSchema:
        sidebarClassicFormat.thumbnailSchema as Prisma.InputJsonValue,
      isActive: sidebarClassicFormat.isActive,
    },
  });

  console.log(`Seeded CvFormat: ${format.id} (${format.name})`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      firstName: "Alex",
      lastName: "Morgan",
      profession: "Full-Stack Engineer",
      passwordHash,
    },
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      firstName: "Alex",
      lastName: "Morgan",
      profession: "Full-Stack Engineer",
      city: "Tel Aviv",
      country: "Israel",
    },
  });

  console.log(
    `Seeded demo user: ${demoUser.email} (password: ${DEMO_PASSWORD})`
  );

  const sampleCv = await prisma.cv.upsert({
    where: { id: "cv_seed_demo_sidebar" },
    update: {
      title: "Alex Morgan — Full-Stack",
      templateId: format.id,
      userId: demoUser.id,
    },
    create: {
      id: "cv_seed_demo_sidebar",
      userId: demoUser.id,
      title: "Alex Morgan — Full-Stack",
      summary: "Seed CV used for sample applications",
      templateId: format.id,
      content: {},
    },
  });

  await prisma.jobApplication.deleteMany({
    where: {
      id: { in: ["app_seed_stripe", "app_seed_monday"] },
    },
  });

  const stripeApp = await prisma.jobApplication.create({
    data: {
      id: "app_seed_stripe",
      userId: demoUser.id,
      cvId: sampleCv.id,
      companyName: "Stripe",
      companyInfo:
        "Payments infrastructure for the internet. ~8k employees. Strong eng culture, deep ownership on billing/API products.",
      jobTitle: "Senior Full-Stack Engineer",
      jobUrl: "https://stripe.com/jobs/listing/full-stack-engineer",
      appliedFrom: "LinkedIn",
      status: "INTERVIEWING",
      stages: {
        create: [
          {
            stageName: "Recruiter screen",
            stageDate: new Date("2026-07-18T10:00:00.000Z"),
            status: "PASSED",
            comments:
              "Discussed ownership of payments tooling and interest in infra-adjacent product work. Strong culture fit signal.",
          },
          {
            stageName: "Technical assessment",
            stageDate: new Date("2026-07-24T14:00:00.000Z"),
            status: "PASSED",
            comments:
              "Take-home focused on API design + React dashboard. Feedback: clean boundaries, solid tests, clear write-up.",
          },
          {
            stageName: "System design interview",
            stageDate: new Date("2026-08-05T15:30:00.000Z"),
            status: "PENDING",
            comments:
              "Prep: webhook delivery, idempotency keys, and multi-tenant billing models.",
          },
        ],
      },
    },
    include: { stages: true },
  });

  const mondayApp = await prisma.jobApplication.create({
    data: {
      id: "app_seed_monday",
      userId: demoUser.id,
      cvId: sampleCv.id,
      companyName: "monday.com",
      companyInfo:
        "Work OS / project management SaaS. Product-heavy frontend team; design system maturity is a hiring priority.",
      jobTitle: "Frontend Engineer",
      jobUrl: "https://monday.com/careers",
      appliedFrom: "Company website",
      status: "REJECTED",
      rejectionReason:
        "Team prioritized a candidate with deeper design-system ownership experience for this opening.",
      stages: {
        create: [
          {
            stageName: "HR screen",
            stageDate: new Date("2026-06-12T09:00:00.000Z"),
            status: "PASSED",
            comments:
              "Walked through recent CV builder work and collaboration with product. Next step: live coding.",
          },
          {
            stageName: "Live coding",
            stageDate: new Date("2026-06-20T11:00:00.000Z"),
            status: "PASSED",
            comments:
              "Built a filterable kanban column component. Interviewer liked accessibility focus and component API.",
          },
          {
            stageName: "Hiring manager interview",
            stageDate: new Date("2026-06-27T13:00:00.000Z"),
            status: "FAILED",
            comments:
              "Role leaned heavily into design-system architecture; my recent work was more product/feature oriented.",
          },
        ],
      },
    },
    include: { stages: true },
  });

  console.log(
    `Seeded JobApplication: ${stripeApp.companyName} (${stripeApp.stages.length} stages)`
  );
  console.log(
    `Seeded JobApplication: ${mondayApp.companyName} (${mondayApp.stages.length} stages)`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
