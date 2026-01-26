'use client';

import type { Task } from '@/app/types/task';
import './ListContainer.scss';

type ListContainerProps = {
  assignedTasks: Task[];
};

export default function ListContainer({ assignedTasks }: ListContainerProps) {
  return (
    <section className="list-container">
      <div className="list-header">
        <div className="list-title">
          <h5>Mes tâches assignées</h5>
          <p>Par ordre de priorité</p>
        </div>

        <input type="search" className="list-search" placeholder="Rechercher une tâche" />
      </div>

      <ul className="task-list">
        {assignedTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </section>
  );
}
