import { Router } from "express";
import * as cvController from "../controllers/cv.controller";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(cvController.listCvs));
router.post("/", asyncHandler(cvController.createCv));
router.get("/:id", asyncHandler(cvController.getCv));
router.patch("/:id", asyncHandler(cvController.updateCv));
router.delete("/:id", asyncHandler(cvController.deleteCv));

export default router;
