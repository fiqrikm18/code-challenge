import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import {
  createTaskBodySchema,
  errorResponseSchema,
  taskIdParamsSchema,
  taskListResponseSchema,
  taskQuerySchema,
  taskResponseEnvelopeSchema,
  updateTaskBodySchema,
} from "../schemas/task.schemas";

export const taskRegistry = new OpenAPIRegistry();

taskRegistry.registerPath({
  method: "get",
  path: "/api/v1/tasks",
  tags: ["Tasks"],
  summary: "List tasks",
  description:
    "Returns a paginated list of tasks with optional title search, completed filter, and sorting.",
  request: { query: taskQuerySchema },
  responses: {
    200: {
      description: "Paginated list of tasks.",
      content: {
        "application/json": { schema: taskListResponseSchema },
      },
    },
    400: {
      description: "Invalid query parameters.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

taskRegistry.registerPath({
  method: "post",
  path: "/api/v1/tasks",
  tags: ["Tasks"],
  summary: "Create a task",
  request: {
    body: {
      content: {
        "application/json": { schema: createTaskBodySchema },
      },
    },
  },
  responses: {
    201: {
      description: "Task created.",
      content: {
        "application/json": { schema: taskResponseEnvelopeSchema },
      },
    },
    400: {
      description: "Invalid request body.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

taskRegistry.registerPath({
  method: "get",
  path: "/api/v1/tasks/{id}",
  tags: ["Tasks"],
  summary: "Get a task by ID",
  request: { params: taskIdParamsSchema },
  responses: {
    200: {
      description: "The requested task.",
      content: {
        "application/json": { schema: taskResponseEnvelopeSchema },
      },
    },
    400: {
      description: "Invalid task ID.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
    404: {
      description: "Task not found.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

taskRegistry.registerPath({
  method: "put",
  path: "/api/v1/tasks/{id}",
  tags: ["Tasks"],
  summary: "Update a task",
  request: {
    params: taskIdParamsSchema,
    body: {
      content: {
        "application/json": { schema: updateTaskBodySchema },
      },
    },
  },
  responses: {
    200: {
      description: "Task updated.",
      content: {
        "application/json": { schema: taskResponseEnvelopeSchema },
      },
    },
    400: {
      description: "Invalid task ID or request body.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
    404: {
      description: "Task not found.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

taskRegistry.registerPath({
  method: "delete",
  path: "/api/v1/tasks/{id}",
  tags: ["Tasks"],
  summary: "Delete a task",
  request: { params: taskIdParamsSchema },
  responses: {
    200: {
      description: "Task deleted. Returns the deleted task.",
      content: {
        "application/json": { schema: taskResponseEnvelopeSchema },
      },
    },
    400: {
      description: "Invalid task ID.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
    404: {
      description: "Task not found.",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(taskRegistry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Task CRUD API",
    version: "1.0.0",
    description:
      "Simple CRUD API for managing tasks with filtering, sorting, and pagination. Request schemas double as runtime validation and are the single source of truth for this document.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Development server" },
  ],
  tags: [{ name: "Tasks", description: "Task management endpoints" }],
});
