'use client';

import { api } from '@/app/api/axiosConfig';
import { useTasks } from '@/app/context/TasksContext';
import type { Task } from '@/app/types/task';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

  const isFormValid = title.trim() !== '' && description.trim() !== '' && dueDate !== '';

  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstAssigneeCheckboxRef = useRef<HTMLInputElement | null>(null);
  const assigneeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const assigneesLabel = useMemo(
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

  // Charger les données de la tâche à l'ouverture de la modal
  useEffect(() => {
    if (!isOpen || !task) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(task.title ?? '');
    setDescription(task.description ?? '');
    setStatus((task.status as Status) ?? 'TODO');
    setPriority((task.priority as Priority) ?? 'MEDIUM');

    const nextDueDate = (() => {
      if (!task.dueDate) return '';
      const d = new Date(task.dueDate);
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
        d.getUTCDate(),
      ).padStart(2, '0')}`;
    })();

    setDueDate(nextDueDate);
    setAssignees([]);
    setIsAssigneeOpen(false);

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => titleInputRef.current?.focus());

    return () => {
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen, task]);

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
        ref={modalRef}
        className="edit-task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        aria-describedby="edit-task-desc"
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
                {assigneesLabel}
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
