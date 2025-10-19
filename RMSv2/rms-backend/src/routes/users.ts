import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router({ mergeParams: true });

// GET /orgs/:orgId/users
router.get("/", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const orgId = req.params.orgId;
    const users = await prisma.user.findMany({ where: { orgId } });
    res.json(users);
  } catch (err) { next(err); }
});

// POST /orgs/:orgId/users
router.post("/", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const orgId = req.params.orgId;
    const payload = req.body;
    const user = await prisma.user.create({
      data: {
        orgId,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        roleId: payload.roleId
      }
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /orgs/:orgId/users/:id
router.put("/:id", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
