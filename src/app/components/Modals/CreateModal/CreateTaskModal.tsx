'use client';

import { api } from '@/app/api/axiosConfig';
import { useTasks } from '@/app/context/TasksContext';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './CreateTaskModal.scss';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

type User = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

export default function CreateModal({ isOpen, onClose, projectId }: Props) {
  const { createTask, isLoading } = useTasks();
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('TODO');

  // Champs (pas encore envoyés)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState<boolean>(false);

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
    if (!title.trim() || !description.trim() || !dueDate) return;

    const dueDateIso = new Date(`${dueDate}T12:00:00.000Z`).toISOString();

    await createTask(projectId, {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDateIso,
      assigneeIds: assignees,
      status, // si backend ignore, ok, sinon retire
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-task-modal-overlay" onClick={onClose}>
      <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="create-task-modal-header">
          <h4>Créer une tâche</h4>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="create-task-modal-body">
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
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
            >
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
                onClick={() => setIsAssigneeOpen((prev) => !prev)}
              >
                {assignees.length === 0
                  ? 'Choisir un ou plusieurs collaborateurs'
                  : `${assignees.length} collaborateur(s) sélectionné(s)`}
              </button>

              {isAssigneeOpen && (
                <div className="assignee-select-dropdown">
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
          <div className="status-container">
            <button
              type="button"
              className={`status-pill todo ${status === 'TODO' ? 'active' : ''}`}
              onClick={() => setStatus('TODO')}
            >
              À faire
            </button>

            <button
              type="button"
              className={`status-pill in-progress ${status === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => setStatus('IN_PROGRESS')}
            >
              En cours
            </button>

            <button
              type="button"
              className={`status-pill done ${status === 'DONE' ? 'active' : ''}`}
              onClick={() => setStatus('DONE')}
            >
              Terminée
            </button>
          </div>
          {/* FOOTER */}
          <div className="create-task-modal-footer">
            <button className="submit-btn" onClick={handleSubmit}>
              + Ajouter une tâche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
