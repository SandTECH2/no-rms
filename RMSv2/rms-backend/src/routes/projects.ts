import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router({ mergeParams: true });

// GET /orgs/:orgId/projects
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const orgId = req.params.orgId;
    const projects = await prisma.project.findMany({ where: { orgId } });
    res.json(projects);
  } catch (err) { next(err); }
});

// POST /orgs/:orgId/projects
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const orgId = req.params.orgId;
    const payload = req.body;
    const projectNumber = (Math.floor(Math.random() * 90000) + 10000).toString();

    const project = await prisma.project.create({
      data: {
        orgId,
        name: payload.name,
        type: payload.type,
        status: payload.status,
        projectManagerId: payload.projectManagerId,
        warehouseId: payload.warehouseId,
        packZoneId: payload.packZoneId,
        planningStart: payload.planningStart,
        planningEnd: payload.planningEnd,
        usageStart: payload.usageStart,
        usageEnd: payload.usageEnd,
        sharedOrgIds: payload.sharedOrgIds || [],
        projectNumber
      }
    });

    res.json(project);
  } catch (err) { next(err); }
});

// GET /orgs/:orgId/projects/:id
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { equipment: true, tasks: true }
    });
    if (!project) return res.status(404).json({ error: "not found" });
    res.json(project);
  } catch (err) { next(err); }
});

// POST /projects/:id/equipment (assign equipment)
router.post("/:id/equipment", requireAuth, async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { catalog_id, serial_id, quantity, is_temp, temp_item_id } = req.body;

    // Use a transaction to check availability and insert assignment
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      if (serial_id) {
        const serial = await tx.equipmentSerial.findUnique({ where: { id: serial_id } });
        if (!serial || serial.status !== "available") throw new Error("serial not available");
        // update serial status and assign
        await tx.equipmentSerial.update({ where: { id: serial_id }, data: { status: "in_use", currentProjectId: projectId } });
      } else {
        // decrement available quantity for bulk
        const catalog = await tx.equipmentCatalog.findUnique({ where: { id: catalog_id } });
        if (!catalog) throw new Error("catalog not found");
        if (catalog.quantityAvailable < quantity) throw new Error("not enough available");
        await tx.equipmentCatalog.update({ where: { id: catalog_id }, data: { quantityAvailable: catalog.quantityAvailable - quantity } });
      }

      const pe = await tx.projectEquipment.create({
        data: {
          projectId,
          catalogId: catalog_id,
          serialId: serial_id,
          quantity: quantity || 1,
          isTemp: !!is_temp,
          tempItemId: temp_item_id || null
        }
      });

      return pe;
    });

    res.json(result);
  } catch (err: any) { next(err); }
});

// POST /projects/:id/temp-items (add subrent)
router.post("/:id/temp-items", requireAuth, async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const payload = req.body;
    // create a ProjectEquipment with isTemp true and store meta in tempItemId (could be separate table)
    const temp = await prisma.projectEquipment.create({
      data: {
        projectId,
        catalogId: payload.catalogId,
        quantity: payload.quantity || 1,
        isTemp: true,
        tempItemId: payload.name || null
      }
    });
    res.json(temp);
  } catch (err) { next(err); }
});

// POST /projects/:id/tasks
router.post("/:id/tasks", requireAuth, async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const payload = req.body;
    const task = await prisma.projectTask.create({
      data: {
        projectId,
        title: payload.title,
        description: payload.description,
        assignedUserId: payload.assignedUserId,
        status: payload.status || "open"
      }
    });
    res.json(task);
  } catch (err) { next(err); }
});

export default router;
