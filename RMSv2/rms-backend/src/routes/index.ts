import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import * as equipmentCtrl from "../controllers/equipment.controller";
import * as projectCtrl from "../controllers/projects.controller";
import * as customerCtrl from "../controllers/customers.controller";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));

// Auth
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);

// Projects
router.get("/projects", projectCtrl.list);
router.post("/projects", projectCtrl.create);

// Customers
router.get("/customers", customerCtrl.list);
router.post("/customers", customerCtrl.create);

// Equipment
router.get("/equipment", equipmentCtrl.getAll);
router.post("/equipment", equipmentCtrl.create);
router.post("/equipment/scan/:serial", equipmentCtrl.scan);

export default router;
