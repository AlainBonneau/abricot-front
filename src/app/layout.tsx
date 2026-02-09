import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#16a34a',
                    },
                  },
                  error: {
                    style: {
                      background: '#dc2626',
                    },
                  },
                }}
              />
            </TasksProvider>
          </ProjectsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
