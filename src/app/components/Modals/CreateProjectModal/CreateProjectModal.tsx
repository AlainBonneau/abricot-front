'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import './CreateProjectModal.scss';

type User = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: Props) {
  // 🧪 Static data (à remplacer plus tard par l'API / provider)
  const fakeUsers: User[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
  const [isContributorOpen, setIsContributorOpen] = useState(false);

  const isFormValid = title.trim() !== '' && description.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // ✅ Static : pas d'appel backend pour le moment
    // Tu pourras remplacer ça plus tard par createProject(...)
    // payload: { name: title.trim(), description: description.trim(), contributorIds: selectedContributorIds }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-project-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="create-project-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        aria-describedby="create-project-desc"
      >
        {/* HEADER */}
        <div className="create-project-modal-header">
          <h4 id="create-project-title">Créer un projet</h4>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre de création"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="create-project-modal-body">
          <p id="create-project-desc" className="sr-only">
            Renseigne le titre, la description et choisis des contributeurs, puis valide.
          </p>

          <label>
            Titre*
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom du projet"
            />
          </label>

          <label>
            Description*
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du projet"
            />
          </label>

          <label>
            Contributeurs :
            <div className="contributor-select">
              <button
                type="button"
                className="contributor-select-trigger"
                aria-label="Ouvrir le sélecteur de contributeurs"
                aria-haspopup="listbox"
                aria-expanded={isContributorOpen}
                onClick={() => setIsContributorOpen((prev) => !prev)}
              >
                {selectedContributorIds.length === 0
                  ? 'Choisir un ou plusieurs contributeurs'
                  : `${selectedContributorIds.length} contributeur(s) sélectionné(s)`}
              </button>

              {isContributorOpen && (
                <div
                  className="contributor-select-dropdown"
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {fakeUsers.map((user) => {
                    const checked = selectedContributorIds.includes(user.id);

                    return (
                      <label key={user.id} className="contributor-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedContributorIds((prev) =>
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

          {/* FOOTER */}
          <div className="create-project-modal-footer">
            <button
              type="button"
              aria-label="Créer le projet"
              className={`submit-btn ${isFormValid ? 'enabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              + Créer le projet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
