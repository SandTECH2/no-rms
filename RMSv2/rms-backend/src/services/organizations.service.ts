import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listOrganizations = async () => {
  const orgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true, projects: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return orgs.map((org: any) => ({
    id: org.id,
    name: org.name,
    users: org._count.users,
    projects: org._count.projects,
  }));
};

export const createOrganization = async (data: { name: string }) => {
  return prisma.organization.create({
    data: { name: data.name },
  });
};
