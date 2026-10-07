import { ITaskService, TaskListParams } from "../services/task.service";
import { catchAsync } from "../utils/catch-async";
import { Request, Response } from "express";
import type { z } from "zod";
import type { taskQuerySchema } from "../schemas/task.schemas";

type TaskQuery = z.infer<typeof taskQuerySchema>;

export class TaskController {
  private readonly taskService: ITaskService;

  constructor(taskService: ITaskService) {
    this.taskService = taskService;
  }

  public createTask = catchAsync(async (req: Request, res: Response) => {
    const newTask = await this.taskService.createTask(req.body);

    res.status(201).json({
      status: "success",
      data: newTask,
    });
  });

  public updateTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    const updatedTask = await this.taskService.updateTask(taskId, req.body);

    res.status(200).json({
      status: "success",
      data: updatedTask,
    });
  });

  public deleteTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    const deletedTask = await this.taskService.deleteTask(taskId);

    res.status(200).json({
      status: "success",
      data: deletedTask,
    });
  });

  public getTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    const task = await this.taskService.getTaskById(taskId);

    res.status(200).json({
      status: "success",
      data: task,
    });
  });

  public getTaskList = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, title, completed, sortField, sortOrder } =
      req.query as unknown as TaskQuery;

    const params: Partial<TaskListParams> = { page, limit };

    if (title !== undefined || completed !== undefined) {
      params.filter = {};
      if (title !== undefined) params.filter.title = title;
      if (completed !== undefined) {
        params.filter.completed = completed === "true";
      }
    }

    if (sortField !== undefined && sortOrder !== undefined) {
      params.sort = {
        field: sortField,
        order: sortOrder,
      };
    }

    const paginatedResult = await this.taskService.getTasks(params);

    res.status(200).json({
      status: "success",
      ...paginatedResult,
    });
  });
}
