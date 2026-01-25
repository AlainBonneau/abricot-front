'use client';

import { useAuth } from '../context/AuthContext';
import './page.scss';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <main className="dashboard-page">
      <section className="dashboard-head">
        <div>
          <h4>Tableau de bord</h4>
          <p>
            Bonjour {user?.name || 'Utilisateur inconnu'}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <button>+ Créer un projet</button>
      </section>
    </main>
  );
}
