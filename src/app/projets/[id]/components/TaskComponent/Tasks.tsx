import type { Task } from '@/app/types/task';
import { dateFormatter, getInitials, taskStatusFormatter } from '@/app/utils/function';
import { CalendarDays, ChevronDown, Ellipsis } from 'lucide-react';
import { useState } from 'react';
import './Tasks.scss';

export default function Tasks({ tasks }: { tasks: Task[] }) {
  console.log(tasks);

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);

  const toggleComments = (taskId: string) => {
    setOpenTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const toggleOptions = (taskId: string) => {
    setOpenOptionsId((prev) => (prev === taskId ? null : taskId));
  };

  if (tasks.length === 0) {
    return <p className="no-tasks-found">Aucune tâche trouvée.</p>;
  }

  return (
    <div className="projet-tasks-component">
      {tasks.map((task) => {
        const isOpen = openTaskId === task.id;
        const isOptionsOpen = openOptionsId === task.id;

        return (
          <div key={task.id} className="projet-task-item">
            <div className="projet-task-items-head">
              <div className="item-title-container">
                <div className="item-title">
                  <h5>{task.title}</h5>
                  <span className={`status-pill status-${task.status.toLowerCase()}`}>
                    {taskStatusFormatter(task.status)}
                  </span>
                </div>

                {/* Options */}
                <div className="item-options-wrapper">
                  <button className="item-options" onClick={() => toggleOptions(task.id)}>
                    <Ellipsis size={20} />
                  </button>

                  {isOptionsOpen && (
                    <div className="item-options-menu">
                      <button className="item-options-action">Modifier</button>
                      <button className="item-options-action delete">Supprimer</button>
                    </div>
                  )}
                </div>
              </div>

              <p className="item-description">{task.description}</p>
            </div>

            <p className="due-date-paragraph">
              Échéance : <CalendarDays className="calendar-icon" />
              <span>{dateFormatter(task.dueDate)}</span>
            </p>

            <div className="assigned-to">
              <p>Assigné à :</p>
              <div className="assigned-to-list">
                {task.assignees?.map((a) => (
                  <div key={a.id} className="assigned-chip-container">
                    <span className="assigned-chip initials">{getInitials(a.user.name)}</span>
                    <span className="assigned-chip">{a.user.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle commentaires */}
            <button
              className={`comments-toggle ${isOpen ? 'open' : ''}`}
              onClick={() => toggleComments(task.id)}
            >
              Commentaires ({task.comments.length})
              <ChevronDown size={16} />
            </button>

            {/* Commentaires */}
            <div className={`comments-container ${isOpen ? 'open' : ''}`}>
              {task.comments.length === 0 ? (
                <p className="no-comments">Aucun commentaire pour le moment</p>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-head">
                      <span className="comment-author">{comment.author.name}</span>
                      <span className="comment-date">{dateFormatter(comment.createdAt)}</span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
