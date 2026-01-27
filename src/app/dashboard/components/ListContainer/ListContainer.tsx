'use client';

import type { Task } from '@/app/types/task';
import TaskComponent from '@/app/components/TaskComponent/TaskComponent';
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

      <div className="task-list">
        {assignedTasks.length === 0 ? (
          <p className="no-tasks-message">Aucune tâche assignée pour le moment.</p>
        ) : (
          assignedTasks.map((task, index) => (
            <TaskComponent key={index} task={task} />
          ))
        )}
      </div>
    </section>
  );
}
