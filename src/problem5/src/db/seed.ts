import "dotenv/config";

import { sql } from "drizzle-orm";

import { db, databaseClient } from "./index.js";
import { tasks, type NewTask } from "./schema.js";

type Status = NonNullable<NewTask["status"]>;
type Priority = NonNullable<NewTask["priority"]>;

const curatedTasks: NewTask[] = [
  {
    title: "Set up project repository",
    description: "Initialize git repo, add README, and configure branch protection rules.",
    status: "completed",
    priority: "high",
  },
  {
    title: "Design database schema",
    description: "Draft ERD for tasks table with status and priority enums plus indexes.",
    status: "completed",
    priority: "high",
  },
  {
    title: "Implement task CRUD API",
    description: "Build create, read, update, and delete endpoints with validation.",
    status: "completed",
    priority: "high",
  },
  {
    title: "Add request validation",
    description: "Validate body, query, and params with zod schemas for task routes.",
    status: "completed",
    priority: "medium",
  },
  {
    title: "Write API documentation",
    description: "Document endpoints, query params, and example curl requests.",
    status: "pending",
    priority: "medium",
  },
  {
    title: "Add pagination and sorting",
    description: "Support page/limit, title search, completed filter, and sort options.",
    status: "pending",
    priority: "medium",
  },
  {
    title: "Set up Docker environment",
    description: "Provide dev and prod compose files for Postgres and the API.",
    status: "pending",
    priority: "low",
  },
  {
    title: "Configure rate limiting",
    description: "Throttle task endpoints to prevent abuse from a single client.",
    status: "pending",
    priority: "low",
  },
  {
    title: "Add unit tests for task service",
    description: "Cover create, update, delete, and filtered listing edge cases.",
    status: "pending",
    priority: "high",
  },
  {
    title: "Fix updated_at trigger",
    description: "Ensure updated_at refreshes automatically on every task update.",
    status: "pending",
    priority: "medium",
  },
  {
    title: "Review security headers",
    description: "Verify helmet, cors, hpp, and morgan settings for production.",
    status: "pending",
    priority: "low",
  },
  {
    title: "Prepare demo seed data",
    description: "Seed a representative mix of pending and completed tasks.",
    status: "pending",
    priority: "low",
  },
];

const actions = [
  "Refactor",
  "Write tests for",
  "Document",
  "Review",
  "Optimize",
  "Fix bug in",
  "Deploy",
  "Monitor",
  "Migrate",
  "Audit",
];

const subjects = [
  "user authentication flow",
  "task search endpoint",
  "pagination helper",
  "Docker build pipeline",
  "CI workflow",
  "error handling middleware",
  "request logging setup",
  "database connection pool",
  "API rate limiter",
  "caching layer",
  "email notification service",
  "file upload handler",
  "background job queue",
  "frontend task list page",
  "mobile responsive layout",
  "accessibility checklist",
  "load testing script",
  "backup and restore runbook",
  "onboarding guide",
  "release notes draft",
];

const descriptions = [
  "Break work into small reviewable commits with clear messages.",
  "Include edge cases and update the relevant runbook section.",
  "Coordinate with the team and leave notes on the design doc.",
  "Measure before and after so the improvement is verifiable.",
  "Add regression coverage so the issue stays fixed.",
];

const priorities: Priority[] = ["low", "medium", "high"];

const DAY_MS = 24 * 60 * 60 * 1000;
const TOTAL_TASKS = 50;

function buildGeneratedTasks(count: number, startAgeDays: number): NewTask[] {
  const now = Date.now();
  const generated: NewTask[] = [];

  for (let i = 0; i < count; i++) {
    const action = actions[i % actions.length];
    const subject = subjects[(i * 3 + 1) % subjects.length];
    const status: Status = i % 5 < 2 ? "completed" : "pending";
    const priority: Priority = priorities[i % priorities.length] ?? "medium";
    const createdAt = new Date(now - (startAgeDays + i) * DAY_MS);
    const updatedAt = new Date(
      createdAt.getTime() + (i % 7) * 3_600_000,
    );

    generated.push({
      title: `${action} ${subject}`,
      description: descriptions[i % descriptions.length] ?? null,
      status,
      priority,
      createdAt,
      updatedAt,
    });
  }

  return generated;
}

async function main(): Promise<void> {
  console.log("Seeding tasks...");

  await db.execute(sql`TRUNCATE TABLE "tasks" RESTART IDENTITY`);

  const remaining = TOTAL_TASKS - curatedTasks.length;
  const sampleTasks: NewTask[] = [
    ...curatedTasks,
    ...buildGeneratedTasks(remaining, curatedTasks.length),
  ];

  const inserted = await db.insert(tasks).values(sampleTasks).returning({
    id: tasks.id,
    title: tasks.title,
    status: tasks.status,
    priority: tasks.priority,
  });

  console.log(`Seeded ${inserted.length} tasks:`);
  for (const task of inserted) {
    console.log(
      `  #${task.id} [${task.status}/${task.priority}] ${task.title}`,
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => databaseClient.end());
