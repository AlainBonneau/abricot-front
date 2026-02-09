'use client';

import Loader from '@/app/components/Loader/Loader';
import CreateProjectModal from '@/app/components/Modals/CreateProjectModal/CreateProjectModal';
import { useProjects } from '@/app/context/ProjectsContext';
import { useTasks } from '@/app/context/TasksContext';
import { useEffect, useState } from 'react';
import ProjectComponent from './components/ProjectComponent/ProjectComponent';
import './page.scss';

export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const { fetchProjectTasks, tasksByProjectId } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!projects.length) return;

    projects.forEach((project) => {
      if (!tasksByProjectId[project.id]) {
        fetchProjectTasks(project.id).catch(() => {});
      }
    });
  }, [projects, tasksByProjectId, fetchProjectTasks]);

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="projets-page">
      <div className="projets-page-head">
        <div className="page-title">
          <h4>Mes projets</h4>
          <p>Gérez vos projets</p>
        </div>

        <button aria-label="Créer un projet" onClick={() => setIsCreateModalOpen(true)}>
          + Créer un projet
        </button>
      </div>

      <section className="projets-list">
        {projects.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          projects.map((project) => (
            <ProjectComponent
              key={project.id}
              project={project}
              tasks={tasksByProjectId[project.id] ?? []}
            />
          ))
        )}
      </section>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
