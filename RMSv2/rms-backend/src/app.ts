import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api", apiRoutes);

  app.get("/", (req, res) => res.json({ ok: true, message: "RMS backend API" }));

  // error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Server error" });
  });

  return app;
}

export default createApp;
