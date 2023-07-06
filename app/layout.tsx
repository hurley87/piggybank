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
        <div className="flex min-h-screen flex-col items-center py-6 bg-white text-gray-700">
          <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
