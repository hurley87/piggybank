import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Onboarding from '@/components/Onboarding';
import LogoutButton from '@/components/LogoutButton';
import Image from 'next/image';
import { Plan } from '@/components/Plan';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  return (
    <div className="w-full px-4 py-0">
      {user ? (
        <>
          <div className="w-full relative flex justify-between">
            <Image src="/fp.png" alt="logo" width={162} height={40} />
            <div className="flex gap-2">
              <LogoutButton />
            </div>
          </div>
          <div className="relative w-full items-center">
            <div className="w-full max-w-sm mx-auto">
              <p>
                Did you know that investors who received professional advice
                were 13% more likely than those who did not to feel confident
                about a secure retirement?
              </p>
              <a
                className="bg-primary text-white p-4 text-md font-bold duration-200 w-full block text-center mt-4 font-montserrat uppercase mb-10"
                href="https://advisorsavvy.com/financial-advisors/"
              >
                Find an advisor for free
              </a>
            </div>
          </div>
          <div className="relative w-full items-center">
            <Plan userId={user.id} />
          </div>
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
