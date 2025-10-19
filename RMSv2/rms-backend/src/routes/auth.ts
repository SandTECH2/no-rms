import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { hash, compareHash } from "../utils/hash";

const router = Router();

// Register (for testing) - create AuthUser and base Organization+User optionally
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, orgName, firstName, lastName } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email+password required" });

    // create org if provided
    let org = undefined;
    if (orgName) {
      org = await prisma.organization.create({ data: { name: orgName } });
    }

    const hashed = await hash(password);
    const authUser = await prisma.authUser.create({
      data: {
        email,
        password: hashed,
        orgId: org?.id,
      },
    });

    // create profile user if org created
    if (org) {
      await prisma.user.create({
        data: {
          orgId: org.id,
          firstName: firstName || "First",
          lastName: lastName || "Last",
          email,
        },
      });
    }

    res.json({ ok: true, id: authUser.id });
  } catch (err) { next(err); }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email+password required" });

    const authUser = await prisma.authUser.findUnique({ where: { email } });
    if (!authUser) return res.status(401).json({ error: "invalid credentials" });

    const valid = await compareHash(password, authUser.password);
    if (!valid) return res.status(401).json({ error: "invalid credentials" });

    const payload = { sub: authUser.id, orgId: authUser.orgId };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "8h" });

    res.json({ token });
  } catch (err) { next(err); }
});

export default router;
