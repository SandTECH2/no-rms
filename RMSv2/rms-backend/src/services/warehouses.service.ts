import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listWarehouses = async () => {
  const warehouses = await prisma.warehouse.findMany({
    include: { organization: true },
    orderBy: { id: "desc" },
  });

  return warehouses.map((warehouse: any) => ({
    id: warehouse.id,
    name: warehouse.name,
    address: warehouse.address,
    internalNote: warehouse.internalNote,
    organization: warehouse.organization?.name ?? "",
  }));
};

export const createWarehouse = async (data: {
  name: string;
  address?: string;
  internalNote?: string;
  organizationId: number;
}) => {
  return prisma.warehouse.create({
    data: {
      name: data.name,
      address: data.address,
      internalNote: data.internalNote,
      organizationId: data.organizationId,
    },
  });
};
