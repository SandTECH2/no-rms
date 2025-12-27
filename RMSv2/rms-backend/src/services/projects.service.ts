import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listProjects = async () => {
  const projects = await prisma.project.findMany({
    include: {
      warehouse: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status,
    projectManager: project.projectManager,
    warehouse: project.warehouse?.name ?? "",
  }));
};

export const createProject = async (data: {
  name: string;
  type: string;
  status: string;
  projectManager?: string;
  warehouseId?: number;
  organizationId?: number;
  clientId?: number;
}) => {
  const numberInDb = `PRJ-${Date.now()}`;
  return prisma.project.create({
    data: {
      name: data.name,
      type: data.type,
      status: data.status,
      numberInDb,
      projectManager: data.projectManager,
      warehouseId: data.warehouseId,
      organizationId: data.organizationId,
      clientId: data.clientId,
    },
  });
};
