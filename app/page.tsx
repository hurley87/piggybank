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

  return (
    <div className="w-full px-4 py-0">
      {user ? (
        <>
          <div className="w-full relative flex justify-between">
            <Image
              src="https://advisorsavvy.com/wp-content/uploads/2019/05/AdvisorSavvy-Logo-RGB.png"
              alt="logo"
              width={162}
              height={40}
            />
            <div className="flex gap-2">
              <p className="pt-2">{user.phone}</p>
              <LogoutButton />
            </div>
          </div>
          <div className="relative w-full items-center">
            <Plan />
          </div>
          <div className="drawer">
            <div className="relative">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            </div>

            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer" className="cursor-pointer"></label>
            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <ul className="p-4 w-80 h-full bg-base-200 text-base-content gap-2">
                {/* Sidebar content here */}
                <li className="pb-4">
                  <h3 className="font-bold">Current Age</h3>
                  <p>{user.user_metadata.currentAge}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Retirement Age</h3>
                  <p>{user.user_metadata.retirementAge}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Retirement Age</h3>
                  <p>{user.user_metadata.retirementAge}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Dependants</h3>
                  <p>{user.user_metadata.dependents}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Annual Income</h3>
                  <p>{user.user_metadata.annualIncome}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Total Savings</h3>
                  <p>{user.user_metadata.totalSavings}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Monthly Savings</h3>
                  <p>{user.user_metadata.monthlySavings}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Income in Retirement</h3>
                  <p>{user.user_metadata.retirementIncome}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">Total Debt</h3>
                  <p>{user.user_metadata.totalDebt}</p>
                </li>
                <li className="pb-2">
                  <h3 className="font-bold">House Equity</h3>
                  <p>{user.user_metadata.houseEquity}</p>
                </li>
                <br />
                <hr />
                <br />
                <p className="pb-2">{user.phone}</p>
                <LogoutButton />
              </ul>
            </div>
          </div>
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
