import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.get("/", taskController.getTaskList);
router.get("/:id", taskController.getTask);
router.post("", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
