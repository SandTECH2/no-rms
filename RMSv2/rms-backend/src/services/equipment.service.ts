import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listEquipment = async () => {
  const items = await prisma.equipment.findMany({
    include: { serialItems: true, warehouse: true },
    orderBy: { id: "desc" },
  });

  return items.map((item: any) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    quantity: item.quantity,
    available: item.available,
    totalQuantity: item.quantity,
    price: item.pricePer ? `Kr ${item.pricePer}/day` : "",
    shelf: item.serialItems[0]?.shelfId ? `Shelf ${item.serialItems[0].shelfId}` : "",
    warehouse: item.warehouse?.name ?? "",
    serialCount: item.serialItems.length,
  }));
};

export const createEquipment = async (data: {
  code: string;
  name: string;
  quantity?: number;
  available?: number;
  pricePer?: number;
  warehouseId?: number;
}) => {
  return prisma.equipment.create({
    data: {
      code: data.code,
      name: data.name,
      quantity: data.quantity ?? 0,
      available: data.available ?? data.quantity ?? 0,
      pricePer: data.pricePer,
      warehouseId: data.warehouseId,
    },
  });
};

// Scan item by serial -> mark returned (status -> Available)
export const scanSerial = async (serialNumber: string) => {
  const item = await prisma.serialItem.findUnique({ where: { serialNumber } });
  if (!item) throw new Error("Item not found");
  await prisma.serialItem.update({ where: { id: item.id }, data: { status: "Available" } });
  return item;
};
