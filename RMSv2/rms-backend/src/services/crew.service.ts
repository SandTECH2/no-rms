import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listCrew = async () => {
  return prisma.crewMember.findMany({
    orderBy: { lastName: "asc" },
  });
};

export const createCrew = async (data: {
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  organizationId?: number;
}) => {
  return prisma.crewMember.create({
    data: {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      role: data.role,
      email: data.email,
      phone: data.phone,
      organizationId: data.organizationId,
    },
  });
};
