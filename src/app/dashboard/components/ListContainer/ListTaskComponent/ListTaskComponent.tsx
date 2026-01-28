import type { Task } from '@/app/types/task';
import { dateFormatter, taskStatusFormatter } from '@/app/utils/function';
import { CalendarDays, FolderOpen, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import './ListTaskComponent.scss';

export default function ListTaskComponent({ task }: { task: Task }) {
  console.log(task);
  return (
    <div className="task-component">
      <div className="task-component-left">
        <div>
          <h5>{task.title}</h5>
          <p>{task.description}</p>
        </div>
        <div className="task-info">
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
      </div>
      <div className="task-component-right">
        <span className={`status-badge status-${task.status.toLowerCase()}`}>
          {taskStatusFormatter(task.status)}
        </span>
        <Link href={`/tasks/${task.id}`} className="view-task-link">
          Voir
        </Link>
      </div>
    </div>
  );
}
