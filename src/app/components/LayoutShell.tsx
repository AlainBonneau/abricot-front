'use client';

import Navbar from '@/app/components/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer';

const HIDE_NAV_ON = ['/login', '/register'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAV_ON.includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="layout">{children}</main>
      {!hideNavbar && <Footer />}
    </>
  );
}
