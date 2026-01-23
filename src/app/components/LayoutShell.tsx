'use client';

import Navbar from '@/app/components/Navbar/page';
import { usePathname } from 'next/navigation';

const HIDE_NAV_ON = ['/login', '/register'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAV_ON.includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
