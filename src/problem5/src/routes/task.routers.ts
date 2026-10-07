import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validator.middleware";
import {
  createTaskBodySchema,
  taskIdParamsSchema,
  taskQuerySchema,
  updateTaskBodySchema,
} from "../schemas/task.schemas";

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.get("/", validateQuery(taskQuerySchema), taskController.getTaskList);
router.get(
  "/:id",
  validateParams(taskIdParamsSchema),
  taskController.getTask,
);
router.post("", validateBody(createTaskBodySchema), taskController.createTask);
router.put(
  "/:id",
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskBodySchema),
  taskController.updateTask,
);
router.delete(
  "/:id",
  validateParams(taskIdParamsSchema),
  taskController.deleteTask,
);

export default router;
