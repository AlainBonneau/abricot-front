import type { Task } from '@/app/types/task';
import { dateFormatter, taskStatusFormatter } from '@/app/utils/function';
import { CalendarDays, FolderOpen, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import './KanbanTaskContainer.scss';

type KanbanTaskContainerProps = {
  tasks: Task[];
};

export default function KanbanTaskContainer({ tasks }: KanbanTaskContainerProps) {
  return (
    <div className="kanban-task-container">
      {tasks.map((task) => (
        <div key={task.id} className="kanban-task-card">
          <div className="kanban-task-header">
            <div className="kanban-task-title">
              <h5>{task.title}</h5>
              <p>{task.description}</p>
            </div>

            <span className={`kanban-status-badge kanban-status-${task.status.toLowerCase()}`}>
              {taskStatusFormatter(task.status)}
            </span>
          </div>

          <div className="kanban-task-info">
            <p>
              <FolderOpen className="lucide-logo" />
              {task.project.name}
            </p>
            <p>
              <CalendarDays className="lucide-logo" />
              {dateFormatter(task.dueDate)}
            </p>
            <p>
              <MessageSquareText className="lucide-logo" />
              {task.comments.length}
            </p>
          </div>
          <Link href={`/projets`} className="view-task-link-kanban">
            Voir
          </Link>
        </div>
      ))}
    </div>
  );
}
