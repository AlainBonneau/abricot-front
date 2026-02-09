'use client';

import { api } from '@/app/api/axiosConfig';
import Loader from '@/app/components/Loader/Loader';
import CreateTaskModal from '@/app/components/Modals/CreateTaskModal/CreateTaskModal';
import EditProjectModal from '@/app/components/Modals/EditProjectModal/EditProjectModal';
import EditTaskModal from '@/app/components/Modals/EditTaskModal/EditTaskModal';
import { useProjects } from '@/app/context/ProjectsContext';
import { useTasks } from '@/app/context/TasksContext';
import type { ProjectMember, ProjectResponse } from '@/app/types/project';
import { Task } from '@/app/types/task';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ContributorComponent from './components/ContributorComponent/ContributorComponent';
import TaskComponent from './components/TaskComponent/TaskComponent';
import './page.scss';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const { projectTasks, fetchProjectTasks, isLoading, error } = useTasks();
  const { deleteProject } = useProjects();

  const [project, setProject] = useState<ProjectResponse['data']['project'] | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

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

  const handleProjectUpdated = (next: {
    name: string;
    description: string;
    members: ProjectMember[];
  }) => {
    setProject((prev) => (prev ? { ...prev, ...next } : prev));
  };

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
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
                  console.log('Erreur récupérée dans la page:', err);

                  let message = 'Erreur lors de la suppression du projet';

                  if (err instanceof Error) {
                    message = err.message;
                  }

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
        <TaskComponent tasks={projectTasks} openEditModal={openEditModal} />
      </section>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={id}
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
        onUpdated={handleProjectUpdated}
      />
    </div>
  );
}
