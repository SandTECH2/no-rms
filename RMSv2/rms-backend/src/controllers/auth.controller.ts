import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { registerUser, validateUser } from "../services/auth.service";

const JWT_SECRET = process.env.JWT_SECRET || "please_change_me";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const user = await registerUser(email, password, name);
  res.json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await validateUser(email, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
}
