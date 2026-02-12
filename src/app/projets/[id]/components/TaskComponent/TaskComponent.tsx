'use client';

import type { Task } from '@/app/types/task';
import { taskStatusFormatter } from '@/app/utils/function';
import { CalendarDays, SquareCheckBig } from 'lucide-react';
import { useMemo, useState } from 'react';
import './TaskComponent.scss';
import Tasks from './Tasks';

type StatusFilter = 'all' | Task['status'];

export default function TaskComponent({
  tasks,
  openEditModal,
}: {
  tasks: Task[];
  openEditModal: (task: Task) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  // Extraire les statuts uniques pour le filtre
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.status)));
  }, [tasks]);

  // Filtrer les tâches en fonction du statut et de la recherche
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchStatus = statusFilter === 'all' ? true : task.status === statusFilter;

      const matchSearch =
        q.length === 0
          ? true
          : (task.title ?? '').toLowerCase().includes(q) ||
            (task.description ?? '').toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [tasks, statusFilter, search]);

  return (
    <div className="projet-task-component">
      <div className="projet-task-head">
        <div className="projet-task-head-left">
          <h5>Tâches</h5>
          <p>Par ordre de priorité</p>
        </div>

        <div className="projet-task-head-right">
          <button className="active" aria-label="Afficher les tâches en vue liste">
            <SquareCheckBig className="icon" />
            Liste
          </button>
          <button aria-label="Afficher les tâches en vue calendrier">
            <CalendarDays className="icon" />
            Calendrier
          </button>

          {/* Filtre status */}
          <select
            id="status-filter"
            name="status-filter"
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Tous</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {taskStatusFormatter(status)}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="search"
            className="task-search"
            placeholder="Rechercher une tâche"
            value={search}
            aria-label="Rechercher une tâche"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tasks tasks={filteredTasks} openEditModal={openEditModal} />
    </div>
  );
}
