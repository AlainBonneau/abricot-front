'use client';

import { api } from '@/app/api/axiosConfig';
import type { AssignedTasksResponse, CreateTaskPayload, Task } from '@/app/types/task';
import { createContext, useContext, useMemo, useState } from 'react';

type TasksContextType = {
  assignedTasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchAssignedTasks: (userId: string) => Promise<void>;
  createTask: (projectId: string, payload: CreateTaskPayload) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedTasks = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<AssignedTasksResponse>('/dashboard/assigned-tasks', {
        params: { userId },
      });

      setAssignedTasks(response.data.data.tasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (projectId: string, payload: CreateTaskPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post(`/projects/${projectId}/tasks`, payload);
      // await fetchAssignedTasks(currentUserId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création de la tâche');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      assignedTasks,
      isLoading,
      error,
      fetchAssignedTasks,
      createTask,
    }),
    [assignedTasks, isLoading, error],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
