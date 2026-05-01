import { useEffect, useRef } from 'react';
import './ConfirmModal.scss';

type ConfirmModalProps = {
  isOpen: boolean;
  question?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  question = 'Êtes-vous sûr de vouloir réaliser cette action ?',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLButtonElement>('button');

    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }

      // Trap focus
      if (e.key === 'Tab' && focusableElements) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="confirm-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-modal__title">Confirmation</h2>

        <p className="confirm-modal__question">{question}</p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__button confirm-modal__button--cancel"
            onClick={onCancel}
          >
            Non
          </button>

          <button
            type="button"
            className="confirm-modal__button confirm-modal__button--confirm"
            onClick={onConfirm}
          >
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}
