// types/task.ts

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type TaskAssignee = {
  id: string;
  userId: string;
  taskId: string;
  user: User;
  assignedAt: string; // ISO
};

export type TaskComment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

interface Project {
  id: string;
  name: string;
  description: string;
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO
  projectId: string;
  project: Project;
  creatorId: string;
  assignees: TaskAssignee[];
  comments: TaskComment[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// Réponse API générique (utile partout)
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Réponse spécifique de /dashboard/assigned-tasks
export type AssignedTasksResponse = ApiResponse<{
  tasks: Task[];
}>;

export type TasksOnlyResponse = { success: boolean; message: string; data: { tasks: Task[] } };
