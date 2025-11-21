import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function registerUser(email: string, password: string, name?: string) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hashed, name }});
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return user;
}
