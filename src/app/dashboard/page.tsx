'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '../components/Loader/page';
import { useAuth } from '../context/AuthContext';
import './page.scss';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <Loader />;
  }

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
      <section className="list-kanban-container">
        <div className="list-kanban-btn-container">
          <button>
            <Image src="/images/list-img.png" alt="logo du bouton liste" width={16} height={16} />
            Liste
          </button>
          <button>
            <Image
              src="/images/kanban-img.png"
              alt="logo du bouton kanban"
              width={16}
              height={16}
            />
            Kanban
          </button>
        </div>
      </section>
    </main>
  );
}
