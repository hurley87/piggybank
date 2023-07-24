'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import va from '@vercel/analytics';

export default function LogoutButton() {
  const router = useRouter();

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    va.track('Logout');
  };

  return (
    <button
      className="py-2 px-4 bg-primary text-white uppercase font-montserrat font-bold"
      onClick={signOut}
    >
      Try again
    </button>
  );
}
