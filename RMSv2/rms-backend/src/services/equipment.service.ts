import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listEquipment = async () => {
  return prisma.equipment.findMany({ include: { serialItems: true, warehouse: true }});
};

export const createEquipment = async (data: any) => {
  return prisma.equipment.create({ data });
};

// Scan item by serial -> mark returned (status -> Available)
export const scanSerial = async (serialNumber: string) => {
  const item = await prisma.serialItem.findUnique({ where: { serialNumber }});
  if (!item) throw new Error("Item not found");
  await prisma.serialItem.update({ where: { id: item.id }, data: { status: "Available" }});
  // Optionally update equipment.available count etc.
  return item;
};
