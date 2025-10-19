import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// list orgs (admin)
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const orgs = await prisma.organization.findMany();
    res.json(orgs);
  } catch (err) { next(err); }
});

// create org
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, settings } = req.body;
    const org = await prisma.organization.create({ data: { name, settings } });
    res.json(org);
  } catch (err) { next(err); }
});

// get org
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const org = await prisma.organization.findUnique({ where: { id: req.params.id } });
    if (!org) return res.status(404).json({ error: "not found" });
    res.json(org);
  } catch (err) { next(err); }
});

export default router;
