import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

const router = Router();

const credentials = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be 2–80 characters"),
    ...credentials,
  ],
  validate,
  register
);

router.post("/login", credentials, validate, login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
