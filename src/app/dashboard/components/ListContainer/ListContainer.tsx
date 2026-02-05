'use client';

import type { Task } from '@/app/types/task';
import { useMemo, useState } from 'react';
import './ListContainer.scss';
import ListTaskComponent from './ListTaskComponent/ListTaskComponent';

type ListContainerProps = {
  assignedTasks: Task[];
};

export default function ListContainer({ assignedTasks }: ListContainerProps) {
  const [search, setSearch] = useState('');

  // Filtrer les tâches en fonction de la recherche
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignedTasks.filter((task) => {
      return (
        (task.title ?? '').toLowerCase().includes(q) ||
        (task.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [assignedTasks, search]);

  return (
    <section className="list-container">
      <div className="list-header">
        <div className="list-title">
          <h5>Mes tâches assignées</h5>
          <p>Par ordre de priorité</p>
        </div>

        <input
          className="list-search"
          type="text"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks-message">Aucune tâche assignée pour le moment.</p>
        ) : (
          filteredTasks.map((task) => <ListTaskComponent key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}
