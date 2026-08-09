import { PrismaClient, type Prisma } from "@prisma/client";
import { sidebarClassicFormat } from "./formats/sidebar-classic";

const prisma = new PrismaClient();

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
