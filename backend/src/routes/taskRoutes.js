import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

const router = Router();

const taskFields = [
  body("title").optional().trim().isLength({ min: 2, max: 120 }),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("status").optional().isIn(["todo", "in-progress", "done"]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be a valid date")
];

router.use(protect);

router.get("/", listTasks);
router.get("/:id", param("id").isMongoId(), validate, getTask);
router.post("/", taskFields, validate, createTask);
router.patch("/:id", [param("id").isMongoId(), ...taskFields], validate, updateTask);
router.delete("/:id", param("id").isMongoId(), validate, deleteTask);

export default router;
