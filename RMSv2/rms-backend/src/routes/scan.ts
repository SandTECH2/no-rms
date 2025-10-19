import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Helper: resolve barcode to serial or catalog
async function resolveBarcode(barcode: string) {
  const serial = await prisma.equipmentSerial.findFirst({ where: { barcode } });
  if (serial) return { type: "serial", record: serial };
  const catalog = await prisma.equipmentCatalog.findFirst({ where: { code: barcode } });
  if (catalog) return { type: "catalog", record: catalog };
  return null;
}

// POST /scan/out -> { project_id, barcode }
router.post("/out", requireAuth, async (req, res, next) => {
  try {
    const { project_id, barcode } = req.body;
    if (!project_id || !barcode) return res.status(400).json({ error: "project_id + barcode required" });

    const resolved = await resolveBarcode(barcode);
    if (!resolved) return res.status(404).json({ error: "barcode not found" });

    if (resolved.type === "serial") {
      const serial = resolved.record as any;
      if (serial.status !== "available") return res.status(400).json({ error: "serial not available" });
      await prisma.$transaction(async (tx: typeof prisma) => {
        await tx.equipmentSerial.update({ where: { id: serial.id }, data: { status: "in_use", currentProjectId: project_id } });
        await tx.projectEquipment.create({
          data: { projectId: project_id, catalogId: serial.catalogId, serialId: serial.id, quantity: 1 }
        });
      });
      return res.json({ ok: true, type: "serial", id: serial.id });
    } else {
      // catalog (bulk)
      const catalog = resolved.record as any;
      if (catalog.quantityAvailable < 1) return res.status(400).json({ error: "no stock available" });
      await prisma.$transaction(async (tx: typeof prisma) => {
        await tx.equipmentCatalog.update({ where: { id: catalog.id }, data: { quantityAvailable: catalog.quantityAvailable - 1 } });
        await tx.projectEquipment.create({ data: { projectId: project_id, catalogId: catalog.id, quantity: 1 } });
      });
      return res.json({ ok: true, type: "catalog", id: catalog.id });
    }

  } catch (err) { next(err); }
});

// POST /scan/in -> { project_id, barcode }
router.post("/in", requireAuth, async (req, res, next) => {
  try {
    const { project_id, barcode } = req.body;
    if (!project_id || !barcode) return res.status(400).json({ error: "project_id + barcode required" });

    const resolved = await resolveBarcode(barcode);
    if (!resolved) return res.status(404).json({ error: "barcode not found" });

    if (resolved.type === "serial") {
      const serial = resolved.record as any;
      // mark serial available and remove assignment
      await prisma.$transaction(async (tx: typeof prisma) => {
        await tx.equipmentSerial.update({ where: { id: serial.id }, data: { status: "available", currentProjectId: null } });
        // optionally update projectEquipment - here we leave historical rows; real system should mark returned qty
      });
      return res.json({ ok: true });
    } else {
      const catalog = resolved.record as any;
      await prisma.equipmentCatalog.update({ where: { id: catalog.id }, data: { quantityAvailable: catalog.quantityAvailable + 1 } });
      return res.json({ ok: true });
    }
  } catch (err) { next(err); }
});

// POST /scan/set-status -> { barcode, status }
router.post("/set-status", requireAuth, async (req, res, next) => {
  try {
    const { barcode, status } = req.body;
    if (!barcode || !status) return res.status(400).json({ error: "barcode+status required" });
    const serial = await prisma.equipmentSerial.findFirst({ where: { barcode } });
    if (!serial) return res.status(404).json({ error: "serial not found" });
    await prisma.equipmentSerial.update({ where: { id: serial.id }, data: { status } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
