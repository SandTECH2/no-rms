import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash("adminpassword", 10);
  await prisma.organization.create({
    data: {
      name: "Default Org",
      warehouses: {
        create: [
          { name: "Main Warehouse", address: "Warehouse address" }
        ]
      },
      customers: {
        create: [
          { legalName: "Customer A", email: "customer@example.com" }
        ]
      },
      projects: {}
    }
  });
  await prisma.user.create({
    data: { email: "admin@local", password: pw, name: "Admin", role: "admin" }
  });
  console.log("Seed complete");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
