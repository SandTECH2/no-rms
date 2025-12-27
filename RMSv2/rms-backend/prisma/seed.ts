import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingOrg = await prisma.organization.findFirst();
  if (existingOrg) {
    console.log("Seed skipped (data already exists)");
    return;
  }

  const pw = await bcrypt.hash("adminpassword", 10);

  const org = await prisma.organization.create({
    data: {
      name: "Default Org",
      warehouses: {
        create: [{ name: "Main Warehouse", address: "Warehouse address" }],
      },
      customers: {
        create: [
          { legalName: "TechCorp AS", email: "contact@techcorp.no", orgNumber: "123456789" },
          { legalName: "EventPro Solutions", email: "info@eventpro.no", orgNumber: "987654321" },
        ],
      },
    },
    include: { warehouses: true, customers: true },
  });

  const warehouseId = org.warehouses[0]?.id ?? null;
  const [firstCustomer, secondCustomer] = org.customers;

  await prisma.project.createMany({
    data: [
      {
        name: "Summer Festival 2024",
        type: "Production",
        status: "confirmed",
        numberInDb: "PRJ-0001",
        projectManager: "John Doe",
        warehouseId,
        clientId: firstCustomer?.id ?? null,
        organizationId: org.id,
      },
      {
        name: "Corporate Event - Tech Summit",
        type: "Sale",
        status: "on-location",
        numberInDb: "PRJ-0002",
        projectManager: "Jane Smith",
        warehouseId,
        clientId: secondCustomer?.id ?? null,
        organizationId: org.id,
      },
    ],
  });

  await prisma.user.create({
    data: { email: "admin@local", password: pw, name: "Admin", role: "admin", organizationId: org.id },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
