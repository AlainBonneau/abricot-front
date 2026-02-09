'use client';

import { api } from '@/app/api/axiosConfig';
import type {
  AssignedTasksResponse,
  CreateTaskPayload,
  Task,
  TasksOnlyResponse,
} from '@/app/types/task';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TasksContextType = {
  assignedTasks: Task[];
  projectTasks: Task[];

  isLoading: boolean;
  error: string | null;

  fetchAssignedTasks: (userId: string) => Promise<void>;
  fetchProjectTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, payload: CreateTaskPayload) => Promise<void>;
  updateTask: (projectId: string, taskId: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  addComment: (projectId: string, taskId: string, content: string) => Promise<void>;
};

type UpdateTaskPayload = CreateTaskPayload;

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les tâches assignées à un utilisateur
  const fetchAssignedTasks = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<AssignedTasksResponse>('/dashboard/assigned-tasks', {
        params: { userId },
      });
      setAssignedTasks(response.data.data.tasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement tâches assignées');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les tâches d'un projet
  const fetchProjectTasks = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get<TasksOnlyResponse>(`/projects/${projectId}/tasks`);
      setProjectTasks(res.data.data.tasks ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement tâches projet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer une tâche
  const createTask = useCallback(
    async (projectId: string, payload: CreateTaskPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        await api.post(`/projects/${projectId}/tasks`, payload);
        await fetchProjectTasks(projectId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur création tâche');
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProjectTasks],
  );

  // Modifier une tâche
  const updateTask = useCallback(
    async (projectId: string, taskId: string, payload: UpdateTaskPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        await api.put(`/projects/${projectId}/tasks/${taskId}`, payload);
        await fetchProjectTasks(projectId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur modification tâche');
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProjectTasks],
  );

  // Supprimer une tâche
  const deleteTask = useCallback(
    async (projectId: string, taskId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`);
        await fetchProjectTasks(projectId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur suppression tâche');
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProjectTasks],
  );

  // Ajouter un commentaire à une tâche
  const addComment = useCallback(async (projectId: string, taskId: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const res = await api.post(`/projects/${projectId}/tasks/${taskId}/comments`, {
        content: trimmed,
      });
      const createdComment = res.data?.data?.comment ?? res.data?.comment ?? res.data;

      setProjectTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [...(task.comments ?? []), createdComment],
              }
            : task,
        ),
      );
      return createdComment;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'ajout du commentaire");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      assignedTasks,
      projectTasks,
      isLoading,
      error,
      fetchAssignedTasks,
      fetchProjectTasks,
      createTask,
      updateTask,
      deleteTask,
      addComment,
    }),
    [
      assignedTasks,
      projectTasks,
      isLoading,
      error,
      fetchAssignedTasks,
      fetchProjectTasks,
      createTask,
      updateTask,
      deleteTask,
      addComment,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
