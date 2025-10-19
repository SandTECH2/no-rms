import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router({ mergeParams: true });

// GET /orgs/:orgId/equipment?stock_type=serialized&available_only=true
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { orgId } = req.params as any;
    const { stock_type, available_only } = req.query;
    const where: any = { orgId };

    if (stock_type) where.stockType = stock_type;
    if (available_only === "true") where.quantityAvailable = { gt: 0 };

    const items = await prisma.equipmentCatalog.findMany({ where, include: { serials: true } });
    res.json(items);
  } catch (err) { next(err); }
});

// POST create catalog item
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { orgId } = req.params as any;
    const payload = req.body;
    // create 5-digit code - naive: org prefix + random (you can replace with a better generator)
    const code = (Math.floor(Math.random() * 90000) + 10000).toString();
    const item = await prisma.equipmentCatalog.create({
      data: {
        orgId,
        code,
        name: payload.name,
        rentalPrice: payload.rentalPrice,
        salePrice: payload.salePrice,
        stockType: payload.stockType || "bulk",
        quantityTotal: payload.quantityTotal || 0,
        quantityAvailable: payload.quantityAvailable || payload.quantityTotal || 0,
        warehouseId: payload.warehouseId,
        shelfId: payload.shelfId
      }
    });
    res.json(item);
  } catch (err) { next(err); }
});

// GET /equipment/:id (detail) - route placed under top-level path in app.ts for brevity
// Add a route in app.ts if you want top-level /equipment/:id - here we implement via param
router.get("/:catalogId/serials", requireAuth, async (req, res, next) => {
  try {
    const { catalogId } = req.params as any;
    const serials = await prisma.equipmentSerial.findMany({ where: { catalogId } });
    res.json(serials);
  } catch (err) { next(err); }
});

// POST /orgs/:orgId/equipment/:catalogId/serials
router.post("/:catalogId/serials", requireAuth, async (req, res, next) => {
  try {
    const { catalogId } = req.params as any;
    const payload = req.body;
    const serial = await prisma.equipmentSerial.create({
      data: {
        catalogId,
        serialNumber: payload.serialNumber,
        barcode: payload.barcode,
        status: payload.status || "available",
        metadata: payload.metadata || {}
      }
    });
    res.json(serial);
  } catch (err) { next(err); }
});

export default router;
