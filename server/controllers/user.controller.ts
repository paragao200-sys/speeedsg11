import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/prisma";
import { Status, Role } from "@prisma/client";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role).default(Role.USER),
  status: z.nativeEnum(Status).default(Status.ACTIVE),
  expirationDate: z.string().optional().nullable(),
});

export class UserController {
  async list(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          expirationDate: true,
          createdAt: true,
        }
      });

      const stats = {
        total: users.length,
        active: users.filter(u => u.status === Status.ACTIVE).length,
        expired: users.filter(u => u.status === Status.EXPIRED).length,
        inactive: users.filter(u => u.status === Status.INACTIVE).length,
      };

      return res.json({ users, stats });
    } catch (error) {
      return res.status(500).json({ error: "Failed to list users" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = userSchema.parse(req.body);

      const existing = await db.user.findUnique({ where: { email: data.email } });
      if (existing) {
        return res.status(400).json({ error: "Email already in use" });
      }

      if (!data.password) {
        return res.status(400).json({ error: "Password is required for new users" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await db.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role as Role,
          status: data.status as Status,
          expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        }
      });

      const { password: _, ...result } = user;
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      return res.status(500).json({ error: "Failed to create user" });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          expirationDate: true,
        }
      });

      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get user" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = userSchema.partial().parse(req.body);

      const updateData: any = { ...data };
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }
      if (data.expirationDate !== undefined) {
        updateData.expirationDate = data.expirationDate ? new Date(data.expirationDate) : null;
      }

      const user = await db.user.update({
        where: { id },
        data: updateData
      });

      const { password: _, ...result } = user;
      return res.json(result);
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await db.user.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }

  async renew(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { months } = req.body; // or specific date

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + (months || 1));

      const user = await db.user.update({
        where: { id },
        data: {
          expirationDate,
          status: Status.ACTIVE
        }
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to renew access" });
    }
  }

  async toggleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await db.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const newStatus = user.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      const updated = await db.user.update({
        where: { id },
        data: { status: newStatus }
      });

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Failed to toggle status" });
    }
  }
}
