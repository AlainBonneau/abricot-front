'use client';

import { api } from '@/app/api/axiosConfig';
import Loader from '@/app/components/Loader/page';
import type { ProjectResponse } from '@/app/types/project';
import type { TasksOnlyResponse } from '@/app/types/task';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContributorComponent from './components/ContributorComponent/ContributorComponent';
import './page.scss';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<ProjectResponse['data']['project'] | null>(null);
  const [tasks, setTasks] = useState<TasksOnlyResponse['data']['tasks']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [resProject, resTasks] = await Promise.all([
          api.get<ProjectResponse>(`/projects/${id}`),
          api.get<TasksOnlyResponse>(`/projects/${id}/tasks`),
        ]);

        console.log('resTasks', resTasks.data.data.tasks);
        console.log('resProject', resProject.data.data.project);
        setProject(resProject.data.data.project);
        setTasks(resTasks.data.data.tasks ?? []);
      } catch {
        setError('Impossible de récupérer le projet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <main className="projet-page">
      <section className="projet-page-head">
        <div className="projet-page-head-left">
          <div className="head-left-title">
            <h4>{project?.name}</h4>
            <button>Modifier</button>
          </div>
          <p>{project?.description}</p>
        </div>
        <div className="projet-page-head-right">
          <button>Créer une tâche</button>
          <button className="create-task-ai-btn">
            <Image src="/images/star.png" alt="IA" width={21} height={21} />
            IA
          </button>
        </div>
      </section>
      <section className="contributor-container">
        <ContributorComponent owner={project?.owner} members={project?.members} />
      </section>
    </main>
  );
}
