import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(userController.getMe));
router.patch("/me", asyncHandler(userController.updateMe));

export default router;
