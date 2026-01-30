import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import LayoutShell from './components/LayoutShell';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { TasksProvider } from './context/TasksContext';
import './globals.scss';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Abricot',
  description: "Notre application de prise de notes simple et efficace boosted par l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable}`}>
        <AuthProvider>
          <ProjectsProvider>
            <TasksProvider>
              <LayoutShell>{children}</LayoutShell>
            </TasksProvider>
          </ProjectsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
