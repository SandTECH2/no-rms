import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listCustomers = async () => {
  const customers = await prisma.customer.findMany({
    orderBy: { id: "desc" },
  });

  return customers.map((customer: any) => ({
    id: customer.id,
    businessName: customer.legalName,
    orgNumber: customer.orgNumber,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  }));
};

export const createCustomer = async (data: {
  businessName: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  return prisma.customer.create({
    data: {
      legalName: data.businessName,
      orgNumber: data.orgNumber,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
};
