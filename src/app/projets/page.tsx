'use client';

import Loader from '@/app/components/Loader/Loader';
import { useProjects } from '@/app/context/ProjectsContext';
import { useState } from 'react';
import CreateProjectModal from '../components/Modals/CreateProjectModal/CreateProjectModal';
import ProjectComponent from './components/ProjectComponent/ProjectComponent';
import './page.scss';

export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          projects.map((project) => <ProjectComponent key={project.id} project={project} />)
        )}
      </section>
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
