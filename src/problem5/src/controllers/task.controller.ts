import {
  ITaskService,
  SortOrder,
  TaskListParams,
  TaskSortField,
} from "../services/task.service";
import { catchAsync } from "../utils/catch-async";
import { Request, Response } from "express";

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
    const taskId = Number.parseInt(req.params.id as string);
    const updatedTask = await this.taskService.updateTask(taskId, req.body);

    res.status(200).json({
      status: "success",
      data: updatedTask,
    });
  });

  public deleteTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = Number.parseInt(req.params.id as string);
    const deletedTask = await this.taskService.deleteTask(taskId);

    res.status(200).json({
      status: "success",
      data: deletedTask,
    });
  });

  public getTask = catchAsync(async (req: Request, res: Response) => {
    const taskId = Number.parseInt(req.params.id as string);
    const task = await this.taskService.getTaskById(taskId);

    res.status(200).json({
      status: "success",
      data: task,
    });
  });

  public getTaskList = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, title, completed, sortField, sortOrder } = req.query;

    const params: Partial<TaskListParams> = {};

    if (page) params.page = Number.parseInt(page as string, 1);
    if (limit) params.limit = Number.parseInt(limit as string, 10);

    if (title || completed !== undefined) {
      params.filter = {};
      if (title) params.filter.title = title as string;
      if (completed !== undefined) {
        params.filter.completed = completed === "true";
      }
    }

    if (sortField && sortOrder) {
      params.sort = {
        field: sortField as TaskSortField,
        order: sortOrder as SortOrder,
      };
    }

    const paginatedResult = await this.taskService.getTasks(params);

    res.status(200).json({
      status: "success",
      ...paginatedResult,
    });
  });
}
