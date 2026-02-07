'use client';

import { api } from '@/app/api/axiosConfig';
import { useTasks } from '@/app/context/TasksContext';
import type { Task } from '@/app/types/task';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './EditTaskModal.scss';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

type User = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task: Task | null;
};

export default function EditTaskModal({ isOpen, onClose, projectId, task }: Props) {
  const { updateTask } = useTasks();
  const taskId = task?.id ?? null;

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<Status>((task?.status as Status) ?? 'TODO');
  const [priority, setPriority] = useState<Priority>((task?.priority as Priority) ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(() => {
    if (!task?.dueDate) return '';
    const d = new Date(task.dueDate);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
      d.getUTCDate(),
    ).padStart(2, '0')}`;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState<boolean>(false);

  const isFormValid = title.trim() !== '' && description.trim() !== '' && dueDate !== '';

  // Charger les contributeurs quand la modal s'ouvre
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/contributors`);
        setUsers(res.data.data.contributors);
      } catch (error) {
        console.error('Erreur chargement contributeurs', error);
      }
    };

    fetchUsers();
  }, [isOpen, projectId]);

  const handleSubmit = async () => {
    if (!taskId) return;
    if (!title.trim() || !description.trim() || !dueDate) return;

    const dueDateIso = new Date(`${dueDate}T12:00:00.000Z`).toISOString();

    try {
      await updateTask(projectId, taskId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDateIso,
        assigneeIds: assignees,
        status,
      });

      onClose();
    } catch (error) {
      console.error('Erreur mise à jour tâche', error);
      alert('Une erreur est survenue lors de la mise à jour de la tâche.');
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="edit-task-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="edit-task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        aria-describedby="edit-task-desc"
      >
        {/* HEADER */}
        <div className="edit-task-modal-header">
          <h4 id="edit-task-title">Modifier la tâche</h4>
          <button className="close-btn" onClick={onClose} aria-label="Fermer la fenêtre d'édition">
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="edit-task-modal-body">
          <p id="edit-task-desc" className="sr-only">
            Modifie les champs puis valide avec le bouton “Enregistrer”.
          </p>

          <label>
            Titre*
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            Description*
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          {/* Priorité */}
          <label>
            Priorité*
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
            </select>
          </label>

          <label>
            Échéance*
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>

          <label>
            Assigné à :
            <div className="assignee-select">
              <button
                type="button"
                className="assignee-select-trigger"
                aria-label="Ouvrir le sélecteur de collaborateurs"
                aria-haspopup="listbox"
                aria-expanded={isAssigneeOpen}
                onClick={() => setIsAssigneeOpen((prev) => !prev)}
              >
                {assignees.length === 0
                  ? 'Choisir un ou plusieurs collaborateurs'
                  : `${assignees.length} collaborateur(s) sélectionné(s)`}
              </button>

              {isAssigneeOpen && (
                <div
                  className="assignee-select-dropdown"
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {users.map((user) => {
                    const checked = assignees.includes(user.id);

                    return (
                      <label key={user.id} className="assignee-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setAssignees((prev) =>
                              checked ? prev.filter((id) => id !== user.id) : [...prev, user.id],
                            )
                          }
                        />
                        <span>{user.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </label>

          {/* STATUS */}
          <div className="status-container" role="radiogroup" aria-label="Statut de la tâche">
            <button
              type="button"
              aria-label='Définir le statut à "À faire"'
              role="radio"
              aria-checked={status === 'TODO'}
              className={`status-pill todo ${status === 'TODO' ? 'active' : ''}`}
              onClick={() => setStatus('TODO')}
            >
              À faire
            </button>

            <button
              type="button"
              aria-label='Définir le statut à "En cours"'
              role="radio"
              aria-checked={status === 'IN_PROGRESS'}
              className={`status-pill in-progress ${status === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => setStatus('IN_PROGRESS')}
            >
              En cours
            </button>

            <button
              type="button"
              aria-label='Définir le statut à "Terminée"'
              role="radio"
              aria-checked={status === 'DONE'}
              className={`status-pill done ${status === 'DONE' ? 'active' : ''}`}
              onClick={() => setStatus('DONE')}
            >
              Terminée
            </button>
          </div>

          {/* FOOTER */}
          <div className="edit-task-modal-footer">
            <button
              type="button"
              aria-label="Enregistrer les modifications"
              className={`submit-btn ${isFormValid ? 'enabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
