'use client';

import { api } from '@/app/api/axiosConfig';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './CreateModal.scss';

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
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('TODO');

  // Champs (pas encore envoyés)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);

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

  if (!isOpen) return null;

  return (
    <div className="create-task-modal-overlay" onClick={onClose}>
      <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="create-task-modal-header">
          <h3>Créer une tâche</h3>
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

          <label>
            Échéance*
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>

          <label>
            Assigné à :
            <select
              multiple
              value={assignees}
              onChange={(e) =>
                setAssignees(Array.from(e.target.selectedOptions).map((option) => option.value))
              }
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
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
        </div>

        {/* FOOTER */}
        <div className="create-task-modal-footer">
          <button
            className="submit-btn"
            onClick={() => {
              console.log('TASK (pas encore envoyée) →', {
                title,
                description,
                dueDate,
                status,
                assignees,
              });
              onClose();
            }}
          >
            + Ajouter une tâche
          </button>
        </div>
      </div>
    </div>
  );
}
