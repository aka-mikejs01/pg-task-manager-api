import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { taskValidator } from "../validators/taskValidator.js";
import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.post("/create", authMiddleware, taskValidator, createTask);
router.get("/", authMiddleware, getAllTask);
router.put("/update/:id", authMiddleware, taskValidator, updateTask);
router.delete("/delete/:id", authMiddleware, deleteTask);

export default router;
