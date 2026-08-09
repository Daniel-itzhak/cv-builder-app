import { Router } from "express";
import authRoutes from "./auth.routes";
import cvRoutes from "./cv.routes";
import formatRoutes from "./format.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cvs", cvRoutes);
router.use("/formats", formatRoutes);

export default router;
