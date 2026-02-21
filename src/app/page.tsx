'use client';

import Link from 'next/link';
import ProtectedRoute from './components/ProtectedRoute';
import './page.scss';

export default function Home() {
  return (
    <ProtectedRoute>
    <div className="home-page-container">
      <h1>Bienvenue sur Abricot !</h1>
      <Link href="/dashboard">
        <button className="btn">Accéder au Dashboard</button>
      </Link>
    </div>
    </ProtectedRoute>
  );
}
