import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../lib/prisma";
import { Status } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await db.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.status === Status.INACTIVE) {
        return res.status(403).json({ error: "Account inactive" });
      }

      if (user.status === Status.EXPIRED) {
        return res.status(403).json({ error: "Access expired" });
      }

      // Final check on expiration date if status wasn't updated yet
      if (user.expirationDate && new Date() > user.expirationDate) {
        await db.user.update({
          where: { id: user.id },
          data: { status: Status.EXPIRED }
        });
        return res.status(403).json({ error: "Access expired" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
