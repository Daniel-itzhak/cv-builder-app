import { Router } from "express";
import authRoutes from "./auth.routes";
import cvRoutes from "./cv.routes";
import formatRoutes from "./format.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cvs", cvRoutes);
router.use("/formats", formatRoutes);

export default router;
