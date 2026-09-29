import { Router } from "express";
import { param } from "express-validator";
import { getUser, listUsers } from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

const router = Router();

router.use(protect, requireRole("admin"));
router.get("/", listUsers);
router.get("/:id", param("id").isMongoId(), validate, getUser);

export default router;
