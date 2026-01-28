import type { Task } from '@/app/types/task';
import './KanbanContainer.scss';
import KanbanTaskContainer from './KanbanTaskContainer/KanbanTaskContainer';

export default function KanbanContainer({ tasks }: { tasks: Task[] }) {
  return (
    <section className="kanban-container">
      <div className="tasks-list-kanban todo-container">
        <h5 className='kanban-title'>
          À faire{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'TODO').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'TODO')
            .map((task) => (
              <KanbanTaskContainer key={task.id} tasks={[task]} />
            ))}
        </div>
      </div>
      <div className="tasks-list-kanban in-progress-container">
        <h5 className='kanban-title'>
          En cours{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'IN_PROGRESS').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'IN_PROGRESS')
            .map((task) => (
              <KanbanTaskContainer key={task.id} tasks={[task]} />
            ))}
        </div>
      </div>
      <div className="tasks-list-kanban done-container">
        <h5 className='kanban-title'>
          Terminé{' '}
          <span className="task-counter">
            {tasks.filter((task) => task.status === 'DONE').length}
          </span>
        </h5>
        <div className="tasks-list">
          {tasks
            .filter((task) => task.status === 'DONE')
            .map((task) => (
              <KanbanTaskContainer key={task.id} tasks={[task]} />
            ))}
        </div>
      </div>
    </section>
  );
}
