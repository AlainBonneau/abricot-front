'use client';

import { api } from '@/app/api/axiosConfig';
import type { Project, UpdateProjectPayload } from '@/app/types/project';
import { createContext, useContext, useEffect, useState } from 'react';

type ProjectsContextType = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  updateProject: (projectId: string, payload: UpdateProjectPayload) => Promise<void>;
  addContributor: (projectId: string, email: string) => Promise<void>;
  removeContributor: (projectId: string, userId: string) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/projects');
      const data = response.data.data.projects;

      setProjects(data);
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (projectId: string, payload: UpdateProjectPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      await api.put(`/projects/${projectId}`, payload);

      await fetchProjects();
    } catch (err) {
      setError('Erreur lors de la mise à jour du projet');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addContributor = async (projectId: string, email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.post(`/projects/${projectId}/contributors`, { email });
    } catch (err) {
      setError("Erreur lors de l'ajout du contributeur");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeContributor = async (projectId: string, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.delete(`/projects/${projectId}/contributors/${userId}`);
    } catch (err) {
      setError('Erreur lors de la suppression du contributeur');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        error,
        refreshProjects: fetchProjects,
        updateProject,
        addContributor,
        removeContributor,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
}
