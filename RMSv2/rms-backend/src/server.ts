import createApp from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = process.env.PORT || 4000;
const app = createApp();

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  try {
    await prisma.$connect();
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection failed", err);
  }
});
