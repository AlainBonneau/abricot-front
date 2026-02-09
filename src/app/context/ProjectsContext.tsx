'use client';

import { api } from '@/app/api/axiosConfig';
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/app/types/project';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type ProjectsContextType = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  createProject: (payload: CreateProjectPayload) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, payload: UpdateProjectPayload) => Promise<void>;
  addContributor: (projectId: string, email: string) => Promise<void>;
  removeContributor: (projectId: string, userId: string) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  // création de projet
  const createProject = async (payload: CreateProjectPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.post('/projects', payload);
      const created: Project | null = res.data?.data?.project ?? null;

      if (created) {
        setProjects((prev) => [created, ...prev]);
        return created;
      }

      await fetchProjects();
      return res.data?.data?.project ?? ({} as Project);
    } catch (err) {
      setError('Erreur lors de la création du projet');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // mise à jour de projet
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

  // Suppression de projet
  const deleteProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        setIsLoading(false);
        return;
      }
      setError(null);
      await api.delete(`/projects/${projectId}`);
      router.push('/projets');
      await fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression du projet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout d'un contributeur
  const addContributor = async (projectId: string, email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.post(`/projects/${projectId}/contributors`, { email });
    } catch (err) {
      setError("Erreur lors de l'ajout du contributeur");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Suppression d'un contributeur
  const removeContributor = async (projectId: string, userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.delete(`/projects/${projectId}/contributors/${userId}`);
    } catch (err) {
      setError('Erreur lors de la suppression du contributeur');
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
        createProject,
        deleteProject,
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
