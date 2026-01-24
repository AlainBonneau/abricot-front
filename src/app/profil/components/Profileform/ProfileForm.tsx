import type { User } from '@/app/types/user';
import { useState } from 'react';
import './ProfileForm.scss';

export default function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // à faire !
    console.log({ name, email });

    setIsCustomizable(false);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          disabled={!isCustomizable}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          disabled={!isCustomizable}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button
          type={isCustomizable ? 'submit' : 'button'}
          onClick={() => {
            if (!isCustomizable) {
              setIsCustomizable(true);
            }
          }}
        >
          {isCustomizable ? 'Enregistrer' : 'Modifier les informations'}
        </button>
      </div>
    </form>
  );
}
