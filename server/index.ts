import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodeCron from "node-cron";
import { PrismaClient, Status } from "@prisma/client";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { db } from "./lib/prisma";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Cron Job: Check for expired users every minute
  nodeCron.schedule("* * * * *", async () => {
    console.log("Running cron job: Checking for expired users...");
    try {
      const now = new Date();
      await db.user.updateMany({
        where: {
          expirationDate: {
            lt: now,
          },
          status: {
            notIn: ["EXPIRED" as Status, "INACTIVE" as Status],
          },
        },
        data: {
          status: "EXPIRED" as Status,
        },
      });
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
