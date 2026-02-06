'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import KanbanContainer from './components/KanbanContainer/KanbanContainer';
import ListContainer from './components/ListContainer/ListContainer';
import './page.scss';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

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
    <div className="dashboard-page">
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
          <button
            className={'dashboard-btn ' + (viewMode === 'list' ? 'btn-active' : '')}
            onClick={() => setViewMode('list')}
          >
            <Image src="/images/list-img.png" alt="logo du bouton liste" width={16} height={16} />
            Liste
          </button>
          <button
            className={'dashboard-btn ' + (viewMode === 'kanban' ? 'btn-active' : '')}
            onClick={() => setViewMode('kanban')}
          >
            <Image
              src="/images/kanban-img.png"
              alt="logo du bouton kanban"
              width={16}
              height={16}
            />
            Kanban
          </button>
        </div>

        {viewMode === 'list' ? (
          <ListContainer assignedTasks={assignedTasks} />
        ) : (
          <KanbanContainer tasks={assignedTasks} />
        )}
      </section>
    </div>
  );
}
