import { Task, TaskPriorityEnum, TaskStatusEnum } from "../models/task.models";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq, and, ilike, asc, desc, count } from "drizzle-orm";
import { AppError } from "../utils/app.error";

export type TaskSortField = "id" | "title" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface TaskListParams {
  page: number;
  limit: number;

  filter?: {
    title?: string;
    completed?: boolean;
  };

  sort?: {
    field: TaskSortField;
    order: SortOrder;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const defaultTaskListParams: Partial<TaskListParams> = {
  page: 1,
  limit: 10,
};

export interface ITaskService {
  createTask(data: { title: string; description: string }): Promise<Task>;
  updateTask(
    id: number,
    data: {
      title: string;
      description: string;
      status: TaskStatusEnum;
      priority: TaskPriorityEnum;
    },
  ): Promise<Task>;
  deleteTask(id: number): Promise<Task>;
  getTaskById(id: number): Promise<Task>;
  getTasks(params: Partial<TaskListParams>): Promise<PaginatedResponse<Task>>;
}

export class TaskService implements ITaskService {
  public async createTask(data: {
    title: string;
    description: string;
  }): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [task] = await tx
        .insert(tasks)
        .values({
          title: data.title,
          description: data.description,
        })
        .returning();

      if (!task) {
        throw new AppError(
          500,
          "INTERNAL_SERVER_ERROR",
          "failed to create task",
        );
      }

      return this._mapToModel(task);
    });
  }

  public async updateTask(
    id: number,
    data: {
      title: string;
      description: string;
      status: TaskStatusEnum;
      priority: TaskPriorityEnum;
    },
  ): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [updatedTask] = await tx
        .update(tasks)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();

      if (!updatedTask) {
        throw new AppError(404, "RESOURCE_NOT_FOUND", "task not found");
      }

      return this._mapToModel(updatedTask);
    });
  }

  public async deleteTask(id: number): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [task] = await tx.delete(tasks).where(eq(tasks.id, id)).returning();

      if (!task)
        throw new AppError(404, "RESOURCE_NOT_FOUND", "task not found");

      return this._mapToModel(task);
    });
  }

  public async getTaskById(id: number): Promise<Task> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!task) throw new AppError(404, "RESOURCE_NOT_FOUND", "task not found");

    return this._mapToModel(task);
  }

  public async getTasks(
    params: Partial<TaskListParams> = defaultTaskListParams,
  ): Promise<PaginatedResponse<Task>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (params.filter?.title) {
      whereConditions.push(ilike(tasks.title, `%${params.filter.title}%`));
    }

    if (params.filter?.completed !== undefined) {
      const statusValue = params.filter.completed ? "completed" : "pending";
      whereConditions.push(eq(tasks.status, statusValue));
    }

    let orderByCondition = desc(tasks.createdAt);

    if (params.sort) {
      const { field, order } = params.sort;
      const sortFunction = order === "asc" ? asc : desc;

      switch (field) {
        case "id":
          orderByCondition = sortFunction(tasks.id);
          break;
        case "title":
          orderByCondition = sortFunction(tasks.title);
          break;
        case "createdAt":
          orderByCondition = sortFunction(tasks.createdAt);
          break;
        case "updatedAt":
          orderByCondition = sortFunction(tasks.updatedAt);
          break;
      }
    }

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(tasks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalItems = totalCountResult?.count ?? 0;
    const totalPages = Math.ceil(totalItems / limit);

    const fetchedTasks = await db
      .select()
      .from(tasks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderByCondition)
      .limit(limit)
      .offset(offset);

    const mappedTasks = fetchedTasks.map((task) => this._mapToModel(task));
    return {
      data: mappedTasks,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  private _mapToModel(task: {
    id: number;
    title: string;
    description: string | null;
    status: "pending" | "completed";
    priority: "low" | "medium" | "high";
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    } as Task;
  }
}
