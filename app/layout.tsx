import './globals.css';

import { AuthProvider } from '@/components/AuthProvider';
import createClient from '@/lib/supabase-server';

// do not cache this layout
export const revalidate = 0;

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
          <main className="flex w-full flex-1 shrink-0 flex-col items-center justify-center px-8 text-center sm:px-20">
            <h1 className="mb-12 text-5xl font-bold sm:text-6xl">
              Next.js with{' '}
              <span className="font-black text-green-400">Supabase</span>
            </h1>
            <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
