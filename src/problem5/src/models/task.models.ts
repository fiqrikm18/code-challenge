export enum TaskStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum TaskPriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  createdAt: Date;
  updatedAt: Date;
}
