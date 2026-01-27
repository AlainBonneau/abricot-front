import type { Task } from '@/app/types/task';
import './KanbanContainer.scss';

export default function KanbanContainer({ tasks }: { tasks: Task[] }) {
  return (
    <section className="kanban-container">
      <div className="tasks-list-kanban todo-container">
        <h5>
          À faire{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'TODO').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'TODO')
            .map((task) => (
              <div key={task.id} className="task-card">
                <h6>{task.title}</h6>
                <p>{task.description}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="tasks-list-kanban in-progress-container">
        <h5>
          En cours{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'IN_PROGRESS').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'IN_PROGRESS')
            .map((task) => (
              <div key={task.id} className="task-card">
                <h6>{task.title}</h6>
                <p>{task.description}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="tasks-list-kanban done-container">
        <h5>
          Terminé{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'DONE').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'DONE')
            .map((task) => (
              <div key={task.id} className="task-card">
                <h6>{task.title}</h6>
                <p>{task.description}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
