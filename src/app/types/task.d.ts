// types/task.d.ts
import type { ApiResponse } from './api';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Si tu veux éviter la duplication, tu peux importer User depuis project.d.ts
// import type { User } from './project';
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskAssignee = {
  id: string;
  userId: string;
  taskId: string;
  user: User;
  assignedAt: string;
};

export type TaskComment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
};

export type TaskProject = {
  id: string;
  name: string;
  description: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  project: TaskProject;
  creatorId: string;
  assignees: TaskAssignee[];
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
};

// GET /projects/:id/tasks
export type TasksOnlyResponse = ApiResponse<{
  tasks: Task[];
}>;

// GET /dashboard/assigned-tasks
export type AssignedTasksResponse = ApiResponse<{
  tasks: Task[];
}>;
