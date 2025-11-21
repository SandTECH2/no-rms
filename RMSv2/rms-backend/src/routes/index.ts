import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import * as eqCtrl from "../controllers/equipment.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Auth
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);

// Equipment
router.get("/equipment", requireAuth, eqCtrl.getAll);
router.post("/equipment", requireAuth, eqCtrl.create);
router.post("/equipment/scan/:serial", requireAuth, eqCtrl.scan);

// Add routes for projects/customers/warehouses similarly

export default router;
