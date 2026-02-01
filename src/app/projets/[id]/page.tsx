'use client';

import { api } from '@/app/api/axiosConfig';
import Loader from '@/app/components/Loader/page';
import type { Task, TasksOnlyResponse } from '@/app/types/task';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './page.scss';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get<TasksOnlyResponse>(`/projects/${id}/tasks`);

        const data = res.data.data;
        const tasksArray: Task[] = Array.isArray(data) ? data : data.tasks;

        setTasks(tasksArray ?? []);
      } catch {
        setError('Impossible de récupérer les tâches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <main className="projets-page">
      <section>
        <h5>Tâches du projet</h5>

        {tasks.length === 0 ? (
          <p>Aucune tâche</p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
