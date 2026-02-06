'use client';

import Loader from '@/app/components/Loader/Loader';
import { useProjects } from '@/app/context/ProjectsContext';
import ProjectComponent from './components/ProjectComponent/ProjectComponent';
import './page.scss';

export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="projets-page">
      <div className="projets-page-head">
        <div className="page-title">
          <h4>Mes projets</h4>
          <p>Gérez vos projets</p>
        </div>
        <button>+ Créer un projet</button>
      </div>

      <section className="projets-list">
        {projects.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          projects.map((project) => <ProjectComponent key={project.id} project={project} />)
        )}
      </section>
    </div>
  );
}
