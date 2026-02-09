'use client';

import { api } from '@/app/api/axiosConfig';
import { useTasks } from '@/app/context/TasksContext';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function CreateTaskModal({ isOpen, onClose, projectId }: Props) {
  const { createTask } = useTasks();

  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('TODO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

  const isFormValid = title.trim() !== '' && description.trim() !== '' && dueDate !== '';

  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstAssigneeCheckboxRef = useRef<HTMLInputElement | null>(null);
  const assigneeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const isOpenAssigneesLabel = useMemo(
    () =>
      assignees.length === 0
        ? 'Choisir un ou plusieurs collaborateurs'
        : `${assignees.length} collaborateur(s) sélectionné(s)`,
    [assignees.length],
  );

  // Permet de focus le premier élément focusable de la modal
  const getFocusableElements = () => {
    const root = modalRef.current;
    if (!root) return [];

    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  };

  const trapTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (active && modalRef.current && !modalRef.current.contains(active)) {
      e.preventDefault();
      first.focus();
      return;
    }

    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Reset le state de la modal à chaque ouverture et focus le titre + restore focus à la fermeture
  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('TODO');
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
    setAssignees([]);
    setIsAssigneeOpen(false);

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => titleInputRef.current?.focus());

    return () => {
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen]);

  // Charger les contributeurs quand la modal s'ouvre
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/contributors`);
        setUsers(res.data.data.contributors ?? []);
      } catch (error) {
        console.error('Erreur chargement contributeurs', error);
        setUsers([]);
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
      status,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-task-modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="create-task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        aria-describedby="create-task-desc"
        tabIndex={-1}
        onKeyDown={(e) => {
          trapTabKey(e);

          if (e.key === 'Escape') {
            if (isAssigneeOpen) {
              setIsAssigneeOpen(false);
              requestAnimationFrame(() => assigneeTriggerRef.current?.focus());
              return;
            }
            onClose();
          }
        }}
      >
        {/* HEADER */}
        <div className="create-task-modal-header">
          <h4 id="create-task-title">Créer une tâche</h4>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre de création de tâche"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="create-task-modal-body">
          <p id="create-task-desc" className="sr-only">
            Renseigne le titre, la description, la priorité, l’échéance, les assignés et le statut,
            puis valide.
          </p>

          <label>
            Titre*
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                ref={assigneeTriggerRef}
                type="button"
                className="assignee-select-trigger"
                aria-label="Ouvrir le sélecteur de collaborateurs"
                aria-haspopup="true"
                aria-expanded={isAssigneeOpen}
                onClick={() => {
                  setIsAssigneeOpen((prev) => !prev);
                  if (!isAssigneeOpen) {
                    requestAnimationFrame(() => firstAssigneeCheckboxRef.current?.focus());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsAssigneeOpen(true);
                    requestAnimationFrame(() => firstAssigneeCheckboxRef.current?.focus());
                  }
                }}
              >
                {isOpenAssigneesLabel}
              </button>

              {isAssigneeOpen && (
                <div className="assignee-select-dropdown">
                  {users.length === 0 ? (
                    <p className="contributors-empty">Aucun collaborateur disponible.</p>
                  ) : (
                    users.map((user, index) => {
                      const checked = assignees.includes(user.id);

                      return (
                        <label key={user.id} className="assignee-option">
                          <input
                            ref={index === 0 ? firstAssigneeCheckboxRef : undefined}
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
                    })
                  )}
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
          <div className="create-task-modal-footer">
            <button
              type="button"
              aria-label="Ajouter la tâche"
              className={`submit-btn ${isFormValid ? 'enabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              + Ajouter une tâche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
