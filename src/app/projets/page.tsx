'use client';

import Loader from '@/app/components/Loader/page';
import { useProjects } from '@/app/context/ProjectsContext';
import './page.scss';

export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>Mes projets</h1>

      {projects.length === 0 ? (
        <p>Aucun projetn pour le momet</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h4>{project.name}</h4>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
