'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './page.scss';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(name, email, password);
    } catch {
      setError('Nom, email ou mot de passe invalide.');
    }
  };

  return (
    <div className="register-page-container">
      <div className="left-container">
        <Image src="/images/abricot.png" alt="Logo Abricot" width={252} height={32} />
        <div className="form-container">
          <h1>Inscription</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">S&apos;inscrire</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
        <div className="already-account">
          <p>Déjà inscrit ?</p>
          <Link href="/login">Se connecter</Link>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
