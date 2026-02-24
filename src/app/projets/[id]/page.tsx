'use client';

import { api } from '@/app/api/axiosConfig';
import Loader from '@/app/components/Loader/Loader';
import CreateAiTaskModal from '@/app/components/Modals/CreateAiTaskModal/CreateAiTaskModal';
import CreateTaskModal from '@/app/components/Modals/CreateTaskModal/CreateTaskModal';
import EditProjectModal from '@/app/components/Modals/EditProjectModal/EditProjectModal';
import EditTaskModal from '@/app/components/Modals/EditTaskModal/EditTaskModal';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useProjects } from '@/app/context/ProjectsContext';
import { useTasks } from '@/app/context/TasksContext';
import type { ProjectMember, ProjectResponse } from '@/app/types/project';
import type { Task } from '@/app/types/task';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ContributorComponent from './components/ContributorComponent/ContributorComponent';
import TaskComponent from './components/TaskComponent/TaskComponent';
import './page.scss';

type LoadState = 'loading' | 'ready' | 'notFound' | 'error';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const {
    projectTasks,
    fetchProjectTasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks();
  const { deleteProject } = useProjects();

  const [project, setProject] = useState<ProjectResponse['data']['project'] | null>(null);

  const [pageState, setPageState] = useState<LoadState>('loading');
  const [pageError, setPageError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageState('notFound');
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setPageState('loading');
        setPageError(null);

        const resProject = await api.get<ProjectResponse>(`/projects/${id}`);
        const proj = resProject.data.data.project;

        if (!isMounted) return;
        setProject(proj);

        await fetchProjectTasks(id);

        if (!isMounted) return;
        setPageState('ready');
      } catch (err: unknown) {
        if (!isMounted) return;

        setProject(null);

        // Gestion spécifique du 404 pour afficher un message "Projet introuvable"
        const status =
          typeof err === 'object' && err !== null && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;

        if (status === 404) {
          setPageState('notFound');
          return;
        }

        setPageState('error');
        setPageError('Ce projet n’existe pas !');
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id, fetchProjectTasks]);

  if (pageState === 'loading') return <Loader />;

  // Gestion du cas où le projet n'existe pas (404)
  if (pageState === 'notFound') {
    return (
      <div className="projet-page">
        <div className="project-error">
          <h1>404 - Projet introuvable</h1>
          <p>Ce projet n’existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  // Gestion d'erreur
  if (pageState === 'error') {
    return (
      <div className="projet-page">
        <div className="project-error">
          <h1>Erreur</h1>
          <p>{pageError}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="projet-page">
        <section className="projet-page-head">
          <div className="projet-page-head-left">
            <div className="head-left-title">
              <h4>{project?.name}</h4>

              <button
                aria-label="Modifier le nom ou la description du projet"
                onClick={() => setIsEditProjectModalOpen(true)}
              >
                Modifier
              </button>

              <button
                onClick={async () => {
                  try {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                      await deleteProject(id);
                      toast.success('Projet supprimé avec succès');
                    }
                  } catch (err) {
                    let message = 'Erreur lors de la suppression du projet';

                    if (err instanceof Error) message = err.message;

                    if (typeof err === 'object' && err !== null && 'response' in err) {
                      const axiosErr = err as { response?: { data?: { message?: string } } };
                      message = axiosErr.response?.data?.message ?? message;
                    }

                    toast.error(message);
                  }
                }}
              >
                Supprimer
              </button>
            </div>

            <p>{project?.description}</p>
          </div>

          <div className="projet-page-head-right">
            <button onClick={() => setIsCreateModalOpen(true)} aria-label="Créer une tâche">
              Créer une tâche
            </button>

            <button
              className="create-task-ai-btn"
              aria-label="Créer une tâche avec l'IA"
              onClick={() => setIsAiModalOpen(true)}
            >
              <Image src="/images/star.png" alt="IA" width={21} height={21} />
              IA
            </button>
          </div>
        </section>

        <section className="contributor-container">
          <ContributorComponent owner={project?.owner} members={project?.members} />
        </section>

        <section className="tasks-container">
          {tasksLoading ? (
            <Loader />
          ) : tasksError ? (
            <p>{tasksError}</p>
          ) : (
            <TaskComponent tasks={projectTasks} openEditModal={openEditModal} />
          )}
        </section>

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          projectId={id}
        />

        <CreateAiTaskModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          refreshTasks={() => fetchProjectTasks(id)}
          projectId={id}
          projectTitle={project?.name}
        />

        <EditTaskModal
          key={selectedTask?.id ?? 'no-task'}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          projectId={id}
          task={selectedTask}
        />

        <EditProjectModal
          key={project?.id ?? 'no-project'}
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
          projectId={id}
          project={project}
          onUpdated={(next: { name: string; description: string; members: ProjectMember[] }) => {
            setProject((prev) => (prev ? { ...prev, ...next } : prev));
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
