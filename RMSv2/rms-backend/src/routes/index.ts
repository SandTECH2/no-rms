import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import * as equipmentCtrl from "../controllers/equipment.controller";
import * as projectCtrl from "../controllers/projects.controller";
import * as customerCtrl from "../controllers/customers.controller";
import * as crewCtrl from "../controllers/crew.controller";
import * as warehouseCtrl from "../controllers/warehouses.controller";
import * as orgCtrl from "../controllers/organizations.controller";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));

// Auth
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);

// Organizations
router.get("/organizations", orgCtrl.list);
router.post("/organizations", orgCtrl.create);

// Warehouses
router.get("/warehouses", warehouseCtrl.list);
router.post("/warehouses", warehouseCtrl.create);

// Projects
router.get("/projects", projectCtrl.list);
router.post("/projects", projectCtrl.create);

// Customers
router.get("/customers", customerCtrl.list);
router.post("/customers", customerCtrl.create);

// Crew
router.get("/crew", crewCtrl.list);
router.post("/crew", crewCtrl.create);

// Equipment
router.get("/equipment", equipmentCtrl.getAll);
router.post("/equipment", equipmentCtrl.create);
router.post("/equipment/scan/:serial", equipmentCtrl.scan);

export default router;
