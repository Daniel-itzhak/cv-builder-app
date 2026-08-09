import { Router } from "express";
import * as formatController from "../controllers/format.controller";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(formatController.listFormats));
router.get("/:id", asyncHandler(formatController.getFormat));

export default router;
