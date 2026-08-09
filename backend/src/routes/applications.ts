import { Router } from "express";
import * as applicationController from "../controllers/application.controller";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(applicationController.listApplications));
router.post("/", asyncHandler(applicationController.createApplication));
router.get("/:id", asyncHandler(applicationController.getApplication));
router.put("/:id", asyncHandler(applicationController.updateApplication));
router.post("/:id/stages", asyncHandler(applicationController.addStage));

export default router;
