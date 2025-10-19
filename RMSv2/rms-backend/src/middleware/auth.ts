import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  auth?: { sub: string; orgId?: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "missing token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    req.auth = { sub: payload.sub, orgId: payload.orgId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
}
