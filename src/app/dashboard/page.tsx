'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../api/axiosConfig';
import Loader from '../components/Loader/page';
import { useAuth } from '../context/AuthContext';
import type { AssignedTasksResponse, Task } from '../types/task';
import ListContainer from './components/ListContainer/ListContainer';
import './page.scss';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const userId = user?.id;

  // appel API pour récupérer les tâches assignées à l'utilisateur
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await api.get<AssignedTasksResponse>('/dashboard/assigned-tasks', {
          params: { userId },
        });

        setAssignedTasks(response.data.data.tasks);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches assignées :', error);
      }
    };

    if (!isLoading && userId) {
      fetchAssignedTasks();
    }
  }, [isLoading, userId]);

  // redirection si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-head">
        <div>
          <h4>Tableau de bord</h4>
          <p>
            Bonjour {user?.name || 'Utilisateur inconnu'}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <button>+ Créer un projet</button>
      </section>
      <section className="list-kanban-container">
        <div className="list-kanban-btn-container">
          <button>
            <Image src="/images/list-img.png" alt="logo du bouton liste" width={16} height={16} />
            Liste
          </button>
          <button>
            <Image
              src="/images/kanban-img.png"
              alt="logo du bouton kanban"
              width={16}
              height={16}
            />
            Kanban
          </button>
        </div>
        <ListContainer assignedTasks={assignedTasks} />
      </section>
    </main>
  );
}
