'use client';

import { api } from '@/app/api/axiosConfig';
import Loader from '@/app/components/Loader/Loader';
import CreateTaskModal from '@/app/components/Modals/CreateModal/CreateTaskModal';
import { useTasks } from '@/app/context/TasksContext';
import type { ProjectResponse } from '@/app/types/project';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContributorComponent from './components/ContributorComponent/ContributorComponent';
import TaskComponent from './components/TaskComponent/TaskComponent';
import './page.scss';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const { projectTasks, fetchProjectTasks, isLoading, error } = useTasks();

  const [project, setProject] = useState<ProjectResponse['data']['project'] | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const resProject = await api.get<ProjectResponse>(`/projects/${id}`);
        setProject(resProject.data.data.project);
      } catch {
        setProject(null);
      }
    };

    fetchProject();
    fetchProjectTasks(id);
  }, [id, fetchProjectTasks]);

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="projet-page">
      <section className="projet-page-head">
        <div className="projet-page-head-left">
          <div className="head-left-title">
            <h4>{project?.name}</h4>
            <button aria-label="Modifier le nom ou la description du projet">Modifier</button>
          </div>
          <p>{project?.description}</p>
        </div>

        <div className="projet-page-head-right">
          <button onClick={() => setIsCreateModalOpen(true)} aria-label="Créer une tâche">
            Créer une tâche
          </button>
          <button className="create-task-ai-btn" aria-label="Créer une tâche avec l'IA">
            <Image src="/images/star.png" alt="IA" width={21} height={21} />
            IA
          </button>
        </div>
      </section>

      <section className="contributor-container">
        <ContributorComponent owner={project?.owner} members={project?.members} />
      </section>

      <section className="tasks-container">
        <TaskComponent tasks={projectTasks} />
      </section>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={id}
      />
    </div>
  );
}
