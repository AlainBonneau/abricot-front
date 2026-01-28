'use client';

import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './page.scss';

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Tableau de bord', icon: '/images/group.png' },
    { href: '/projects', label: 'Projets', icon: '/images/union.png' },
  ];

  return (
    <header>
      <Image src="/images/abricot.png" alt="Logo" width={147} height={18} />

      {/* Barre de navigation ordinateur */}
      <nav>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? 'nav-link active' : 'nav-link'}
          >
            <Image src={link.icon} alt="" className="nav-logo" width={20} height={20} />
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Profil de l'utilisateur */}
      <div className="header-actions">
        {user && (
          <Link href="/profil">
            <span className={`user-logo ${isActive('/profil') ? 'profil-active' : ''}`}>
              {user.name.slice(0, 2)}
            </span>
          </Link>
        )}

        <button
          type="button"
          className="burger-btn"
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className={`burger ${isMenuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Barre de navigation mobile */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'mobile-link active' : 'mobile-link'}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href="/profil"
              className={isActive('/profil') ? 'mobile-link active' : 'mobile-link'}
            >
              Profil
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
