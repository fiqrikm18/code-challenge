import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const taskStatusSchema = z
  .enum(["pending", "completed"])
  .openapi({ example: "pending" });

export const taskPrioritySchema = z
  .enum(["low", "medium", "high"])
  .openapi({ example: "medium" });

export const createTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(255).openapi({
      description: "Short summary of the task.",
      example: "Write API documentation",
    }),
    description: z.string().trim().min(1).max(5000).openapi({
      description: "Longer details about the task.",
      example: "Document endpoints, query params, and example requests.",
    }),
  })
  .openapi("CreateTaskRequest");

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(255).openapi({
      example: "Write API documentation",
    }),
    description: z.string().trim().min(1).max(5000).openapi({
      example: "Document endpoints, query params, and example requests.",
    }),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
  })
  .openapi("UpdateTaskRequest");

export const taskIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .openapi({ description: "Task ID.", example: 1 }),
});

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    description: "Page number (1-based).",
    example: 1,
  }),
  limit: z.coerce.number().int().min(1).max(100).default(10).openapi({
    description: "Items per page (max 100).",
    example: 10,
  }),
  title: z.string().min(1).max(200).optional().openapi({
    description: "Case-insensitive partial match on the task title.",
    example: "docker",
  }),
  completed: z
    .enum(["true", "false"])
    .optional()
    .openapi({
      description:
        '"true" filters completed tasks, "false" filters pending tasks.',
      example: "true",
    }),
  sortField: z
    .enum(["id", "title", "createdAt", "updatedAt"])
    .optional()
    .openapi({ example: "createdAt" }),
  sortOrder: z.enum(["asc", "desc"]).optional().openapi({ example: "desc" }),
});

export const taskResponseSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    title: z.string().openapi({ example: "Implement task CRUD API" }),
    description: z.string().nullable().openapi({
      example: "Build create, read, update, and delete endpoints.",
    }),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    createdAt: z.string().datetime().openapi({
      description: "ISO 8601 timestamp.",
    }),
    updatedAt: z.string().datetime().openapi({
      description: "ISO 8601 timestamp.",
    }),
  })
  .openapi("Task");

function successEnvelope(dataSchema: z.ZodTypeAny, name: string) {
  return z
    .object({
      status: z.literal("success").openapi({ example: "success" }),
      data: dataSchema,
    })
    .openapi(name);
}

export const taskListResponseSchema = successEnvelope(
  z.array(taskResponseSchema),
  "TaskListResponse",
);

export const taskResponseEnvelopeSchema = successEnvelope(
  taskResponseSchema,
  "TaskResponse",
);

export const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "RESOURCE_NOT_FOUND" }),
      message: z.string().openapi({ example: "task not found" }),
    }),
  })
  .openapi("ErrorResponse");
