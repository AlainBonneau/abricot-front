'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '../components/Loader/page';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import ListContainer from './components/ListContainer/ListContainer';
import './page.scss';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const { assignedTasks, fetchAssignedTasks, isLoading: tasksLoading, error } = useTasks();

  const userId = user?.id;

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!isLoading && userId) {
      fetchAssignedTasks(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, userId]);

  if (isLoading || !user || tasksLoading) return <Loader />;

  return (
    <main className="dashboard-page">
      <section className="dashboard-head">
        <div>
          <h4>Tableau de bord</h4>
          <p>Bonjour {user.name}, voici un aperçu de vos projets et tâches</p>
        </div>
        <button>+ Créer un projet</button>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
