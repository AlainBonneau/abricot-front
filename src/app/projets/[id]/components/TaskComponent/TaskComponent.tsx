import type { Task } from '@/app/types/task';
import { CalendarDays, SquareCheckBig } from 'lucide-react';
import './TaskComponent.scss';

export default function TaskComponent({ tasks }: { tasks: Task[] }) {
  return (
    <div className="projet-task-component">
      <div className="projet-task-head">
        <div className="projet-task-head-left">
          <h5>Tâches</h5>
          <p>Par ordre de priorité</p>
        </div>
        <div className="projet-task-head-right">
          <button className="active">
            <SquareCheckBig className="icon" />
            Liste
          </button>
          <button>
            <CalendarDays className="icon" />
            Calendrier
          </button>
          {/*  input déroulant qui permet d'afficher les status des tâches */}
          <select name="status-filter" id="status-filter" className="status-filter">
            <option value="all">Tous</option>
            {tasks
              .map((task) => task.status)
              .filter((status, index, self) => self.indexOf(status) === index)
              .map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
          </select>
          <input type="search" className="task-search" placeholder="Rechercher une tâche" />
        </div>
      </div>
    </div>
  );
}
