'use client';

import { api } from '@/app/api/axiosConfig';
import { Check, Pencil, SendHorizonal, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './CreateAiTaskModal.scss';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

type GeneratedTask = {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle?: string;
  // Optionnel: callback pour refresh après création
  onTasksCreated?: () => void;
};

// Permet de créer une tâche dans le projet via l'API
async function createTaskInProject(projectId: string, task: GeneratedTask) {
  await api.post(`/projects/${projectId}/tasks`, task);
}

export default function CreateAiTaskModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onTasksCreated,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState<'PROMPT' | 'LIST'>('PROMPT');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const canSend = useMemo(() => prompt.trim().length >= 6, [prompt]);
  const canCreate = useMemo(() => tasks.length > 0 && !isCreating, [tasks.length, isCreating]);

  // Focus + ESC
  useEffect(() => {
    if (!isOpen) return;

    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state à l'ouverture du modal
  useEffect(() => {
    if (!isOpen) return;
    setPrompt('');
    setStep('PROMPT');
    setTasks([]);
    setError(null);
    setIsGenerating(false);
    setIsCreating(false);
    setEditIndex(null);
    setEditTitle('');
    setEditDescription('');
  }, [isOpen]);

  if (!isOpen) return null;

  const generateTasks = async () => {
    if (!canSend || isGenerating) return;
    try {
      setIsGenerating(true);
      setError(null);

      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectTitle }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? 'Erreur IA');
        return;
      }

      const generated: GeneratedTask[] = json?.data?.tasks ?? [];
      setTasks(generated);
      setStep('LIST');
    } catch {
      setError('Impossible de contacter l’IA');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const startEdit = (index: number) => {
    const t = tasks[index];
    setEditIndex(index);
    setEditTitle(t.title);
    setEditDescription(t.description ?? '');
  };

  const saveEdit = () => {
    if (editIndex === null) return;
    const title = editTitle.trim();
    if (title.length < 3) return;

    setTasks((prev) =>
      prev.map((t, i) =>
        i === editIndex ? { ...t, title, description: editDescription.trim() } : t,
      ),
    );

    setEditIndex(null);
  };

  const createAllTasks = async () => {
    if (!canCreate) return;

    try {
      setIsCreating(true);
      setError(null);

      for (const task of tasks) {
        await createTaskInProject(projectId, task);
      }

      onTasksCreated?.();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? 'Erreur lors de la création des tâches');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="ai-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="ai-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Création de tâches par IA"
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="ai-modal-close" aria-label="Fermer" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="ai-modal-content">
          {step === 'PROMPT' ? (
            <div className="ai-step">
              <div className="ai-title">
                <span className="sparkle">✨</span>
                <h3>Créer une tâche</h3>
              </div>

              {error && <p className="ai-error">{error}</p>}

              <div className="ai-empty-space" />

              <div className="ai-bottom-bar">
                <input
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                  aria-label="Prompt IA"
                />

                <button
                  className="ai-send"
                  onClick={generateTasks}
                  disabled={!canSend || isGenerating}
                  aria-label="Générer les tâches"
                >
                  {isGenerating ? (
                    <span className="ai-loader" aria-hidden="true" />
                  ) : (
                    <SendHorizonal size={16} />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="ai-step">
              <div className="ai-title">
                <span className="sparkle">✨</span>
                <h3>Vos tâches...</h3>
              </div>

              {error && <p className="ai-error">{error}</p>}

              <div className="ai-list">
                {tasks.map((t, idx) => (
                  <div className="ai-task-card" key={`${t.title}-${idx}`}>
                    {editIndex === idx ? (
                      <>
                        <input
                          className="ai-edit-title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          aria-label="Titre de la tâche"
                        />
                        <input
                          className="ai-edit-desc"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          aria-label="Description de la tâche"
                        />
                        <div className="ai-actions">
                          <button className="ai-action" onClick={() => removeTask(idx)}>
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                          <span className="ai-sep" />
                          <button className="ai-action" onClick={saveEdit}>
                            <Check size={14} />
                            Enregistrer
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4>{t.title}</h4>
                        <p>{t.description || '—'}</p>

                        <div className="ai-actions">
                          <button className="ai-action" onClick={() => removeTask(idx)}>
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                          <span className="ai-sep" />
                          <button className="ai-action" onClick={() => startEdit(idx)}>
                            <Pencil size={14} />
                            Modifier
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="ai-center">
                <button className="ai-add" onClick={createAllTasks} disabled={!canCreate}>
                  {isCreating ? 'Création...' : '+ Ajouter les tâches'}
                </button>
              </div>

              <div className="ai-bottom-bar">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                  aria-label="Prompt IA"
                />
                <button
                  className="ai-send"
                  onClick={generateTasks}
                  disabled={!canSend || isGenerating}
                  aria-label="Regénérer"
                >
                  {isGenerating ? (
                    <span className="ai-loader" aria-hidden="true" />
                  ) : (
                    <SendHorizonal size={16} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
