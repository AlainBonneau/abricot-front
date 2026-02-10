'use client';

import { useState } from 'react';

export default function Test() {
  const [prompt, setPrompt] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? 'Erreur IA');
        return;
      }

      setTasks(json.data.tasks ?? []);
    } catch {
      setError('Impossible de contacter l’IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Test Génération de Tâches</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Détails pour la génération de tâches..."
        rows={5}
        style={{ width: '100%' }}
      />
      <button onClick={generate} disabled={isLoading} style={{ marginTop: '10px' }}>
        {isLoading ? 'Génération en cours...' : 'Générer les tâches'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Tâches Générées :</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <strong>{task.title}</strong> - {task.description} [{task.status}, {task.priority}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
