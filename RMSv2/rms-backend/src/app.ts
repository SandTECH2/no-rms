import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import orgRoutes from "./routes/orgs";
import userRoutes from "./routes/users";
import equipmentRoutes from "./routes/equipment";
import projectRoutes from "./routes/projects";
import scanRoutes from "./routes/scan";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/auth", authRoutes);
  app.use("/orgs", orgRoutes);
  app.use("/orgs/:orgId/users", userRoutes);
  app.use("/orgs/:orgId/equipment", equipmentRoutes);
  app.use("/orgs/:orgId/projects", projectRoutes);
  app.use("/scan", scanRoutes);

  app.get("/", (req, res) => res.json({ ok: true, message: "MVP system API" }));

  // error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Server error" });
  });

  return app;
}

export default createApp;
