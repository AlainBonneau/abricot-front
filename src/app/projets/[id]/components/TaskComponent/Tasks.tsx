import type { Task } from '@/app/types/task';
import './Tasks.scss';

export default function Tasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="projet-tasks-component">
      {tasks.map((task) => (
        <div key={task.id} className="projet-task-item">
          <div className="projet-task-items-head">
            <div className="item-title">
              <h5>{task.title}</h5>
              <span>{task.status}</span>
            </div>
            <p className="item-description">{task.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
