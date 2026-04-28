import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

// Apply auth for all user routes
router.use(authMiddleware);

// Only admins can access these
router.get("/", adminMiddleware, controller.list);
router.post("/", adminMiddleware, controller.create);
router.get("/:id", adminMiddleware, controller.get);
router.put("/:id", adminMiddleware, controller.update);
router.delete("/:id", adminMiddleware, controller.delete);
router.patch("/:id/renew", adminMiddleware, controller.renew);
router.patch("/:id/toggle-status", adminMiddleware, controller.toggleStatus);

export { router as userRoutes };
