"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './page.scss';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Email ou mot de passe invalide.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="left-container">
        <Image src="/images/abricot.png" alt="Logo Abricot" width={252} height={32} />
        <div className="form-container">
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" aria-label='Se connecter'>Se connecter</button>
            {error && <p className="error-message">{error}</p>}
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
          </form>
        </div>
        <div className="create-account">
          <p>Pas encore de compte ?</p>
          <Link href="/register">Créer un compte</Link>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
