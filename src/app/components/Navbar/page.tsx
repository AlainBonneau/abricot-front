"use client";

import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import './page.scss';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header>
      <Image src="/images/abricot.png" alt="Logo" width={147} height={18} />
      <nav>
        <Link href="/dashboard">
          <Image
            src="/images/group.png"
            alt="Menu Icon"
            className="nav-logo"
            width={20}
            height={20}
          />
          Tableau de bord
        </Link>
        <Link href="/projects">
          <Image
            src="/images/union.png"
            alt="Menu Icon"
            className="nav-logo"
            width={20}
            height={20}
          />
          Projets
        </Link>
      </nav>
      {user && (
        <Link href="/profil">
          <span className="user-logo profil-active">{user.name.slice(0, 2)}</span>
        </Link>
      )}
    </header>
  );
}
