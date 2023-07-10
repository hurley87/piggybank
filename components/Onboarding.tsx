'use client';

import { useState } from 'react';
import { Answer } from './Answer';
import endent from 'endent';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Onboarding = () => {
  const [view, setView] = useState<string>('currentAge');
  const [retirementAge, setRetirementAge] = useState<string>('61 - 65');
  const [currentAge, setCurrentAge] = useState<string>('36 - 45');
  const [riskTolerance, setRiskTolerance] = useState<string>('50');
  const [dependents, setDependents] = useState<string>('0');
  const [annualIncome, setAnnualIncome] = useState<string>(
    '$150,000 - $249,999'
  );
  const [totalSavings, setTotalSavings] = useState<string>(
    '$250,000 - $999,999'
  );
  const [monthlySavings, setMonthlySavings] = useState<string>('$500 - $999');
  const [retirementIncome, setRetirementIncome] =
    useState<string>('$75,000 - $99,999');
  const [totalDebt, setTotalDebt] = useState<string>('less than $40,000');
  const [houseEquity, setHouseEquity] = useState<string>('No, I rent');
  const [answer, setAnswer] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>();
  const [sendCode, setSendCode] = useState<boolean>(false);
  const supabase = createClientComponentClient();
  const [verifiedFailed, setVerifiedFailed] = useState<boolean>(false);

  function ProgressBar({ width }: { width: string }) {
    return (
      <div className="w-full bg-gray-100 h-4 rounded-full">
        <div className={width + ' bg-primary rounded-full h-4'}></div>
      </div>
    );
  }

  function RadioOption({
    name,
    value,
    currentValue,
    onChange,
  }: {
    name: string;
    value: string;
    onChange: any;
    currentValue: string;
  }) {
    return (
      <div
        key={value}
        className="flex items-center mb-4 cursor-pointer"
        onClick={onChange}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={value === currentValue}
          className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          onChange={onChange}
        />
        <label className="text-sm font-medium ml-2 block font-nunito">
          {value}
        </label>
      </div>
    );
  }

  async function handleSignIn() {
    setSendCode(true);
    let response = await supabase.auth.signInWithOtp({
      phone: `+1${phoneNumber}`,
      options: {
        data: {
          currentAge,
          retirementAge,
          dependents,
          annualIncome,
          totalSavings,
          monthlySavings,
          retirementIncome,
          totalDebt,
          houseEquity,
          postalCode,
          riskTolerance,
          firstName,
        },
      },
    });

    console.log(response);

    if (response.error) {
      console.log('ERRROR');
    } else {
      setView('verifyPhoneNumber');
    }
  }

  async function handleVerify() {
    let response = await supabase.auth.verifyOtp({
      phone: `+1${phoneNumber}`,
      token: `${verificationCode}`,
      type: 'sms',
    });

    if (response.error) {
      console.log('ERRROR');
      setVerifiedFailed(true);
    } else {
      setView('answer');
      const prompt = endent`
    Consider ${firstName}, a Canadian between the ages of ${currentAge} with ${dependents} kids that has an annual income between ${annualIncome}, has between ${totalSavings} in savings and investments, and saves between ${monthlySavings} per month. They'd like between ${retirementIncome} income per year in retirement and they have ${totalDebt} in debt. I asked if they have a mortgage  and they said "${houseEquity}". Can they retire between the ages of ${retirementAge}? Give their likely retirement age in one sentence and three tips that may help them retire earlier. Be concise and only recommend they speak to a financial advisor at the end. 

    When you answer, answer in a friendly, playful tone and write your answer as if you were giving casual advice to ${firstName}. 

    `;

      const answerResponse = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!answerResponse.ok) {
        console.log('ERRROR');
      }

      const data = answerResponse.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setAnswer((prev) => prev + chunkValue);
      }
    }
  }

  const addPlan = async (plan: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    if (plan.length) {
      const { data, error } = await supabase
        .from('Plans')
        .insert([
          {
            userId: user?.id,
            plan,
            createdAt: new Date(),
            retirementAge,
            currentAge,
            dependents,
            annualIncome,
            totalSavings,
            monthlySavings,
            retirementIncome,
            totalDebt,
            houseEquity,
            postalCode,
            riskTolerance,
            firstName,
            phoneNumber,
          },
        ])
        .select();

      if (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full p-4 max-w-sm mx-auto">
      <div className="column w-full">
        {view === 'currentAge' && (
          <div className="flex flex-col gap-10 w-full">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              How old are you?
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nunito"
                htmlFor="currentAge"
              >
                Your age
              </label>
              <fieldset>
                {[
                  'Over 65',
                  '61 - 65',
                  '56 - 60',
                  '51 - 55',
                  '46 - 50',
                  '36 - 45',
                  'Under 35',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setCurrentAge(value)}
                    currentValue={currentAge}
                  />
                ))}
              </fieldset>
            </div>

            <button
              onClick={() => setView('retirementAge')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
          </div>
        )}
        {view === 'retirementAge' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              When would you like to retire?
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="retirementAge"
              >
                Your retirement age
              </label>
              <fieldset>
                {['Over 65', '61 - 65', '56 - 60', '51 - 55'].map((value) => (
                  <RadioOption
                    name="retirementAge"
                    value={value}
                    onChange={() => setRetirementAge(value)}
                    currentValue={retirementAge}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-1/12" />
            <button
              onClick={() => setView('dependents')}
              className="bg-primary text-white p-4 text-xl font-bold"
            >
              Next
            </button>
            <button
              onClick={() => setView('retirementAge')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}

        {view === 'dependents' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              How many kids do you have?
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="dependents"
              >
                Number of dependent children
              </label>
              <fieldset>
                {['0', '1', '2', '3', '3+'].map((value) => (
                  <RadioOption
                    name="dependents"
                    value={value}
                    onChange={() => setDependents(value)}
                    currentValue={dependents}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-2/12" />
            <button
              onClick={() => setView('risk')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('currentAge')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'risk' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Risk Tolerance
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="dependents"
              >
                How much risk are you willing to take with your savings?
              </label>
              <input
                type="range"
                onChange={(e) => setRiskTolerance(e.target.value)}
                min={0}
                max="100"
                value={riskTolerance}
                className="range range-primary mt-4"
                step="25"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>Little</span>
                <span></span>
                <span>Moderate</span>
                <span></span>
                <span>Large</span>
              </div>
            </div>
            <ProgressBar width="w-3/12" />
            <button
              onClick={() => setView('annualIncome')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('dependents')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'annualIncome' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Annual household income
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="annualIncome"
              >
                Your gross household income each year (before taxes)
              </label>
              <fieldset>
                {[
                  'less than $40,000',
                  '$40,000 - $74,999',
                  '$75,000 - $99,999',
                  '$100,000 - $149,999',
                  '$150,000 - $249,999',
                  'Over $250,000',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setAnnualIncome(value)}
                    currentValue={annualIncome}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-4/12" />
            <button
              onClick={() => setView('totalSavings')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('risk')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'totalSavings' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Total savings and investments
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="totalSavings"
              >
                In total, how much do you have in savings and investments?
              </label>
              <fieldset>
                {[
                  'less than $25,000',
                  '$25,000 - $99,999',
                  '$100,000 - $249,999',
                  '$250,000 - $999,999',
                  '$1,000,000 - $4,999,999',
                  'Over $5,000,000',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setTotalSavings(value)}
                    currentValue={totalSavings}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-5/12" />
            <button
              onClick={() => setView('monthlySavings')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('annualIncome')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'monthlySavings' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Total household monthly savings
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="monthlySavings"
              >
                In total, how much do you think you save each month?
              </label>
              <fieldset>
                {[
                  'Less than $100',
                  '$100 - $249',
                  '$250 - $499',
                  '$500 - $999',
                  '$1,000 - $1,999',
                  'Over $2,000',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setMonthlySavings(value)}
                    currentValue={monthlySavings}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-6/12" />
            <button
              onClick={() => setView('retirementIncome')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('totalSavings')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}

        {view === 'retirementIncome' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Annual household income in retirement
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="retirementIncome"
              >
                In total, how much do you think you need each year for your
                retirement?
              </label>
              <fieldset>
                {[
                  'less than $40,000',
                  '$40,000 - $74,999',
                  '$75,000 - $99,999',
                  '$100,000 - $149,999',
                  '$150,000 - $249,999',
                  'Over $250,000',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setRetirementIncome(value)}
                    currentValue={retirementIncome}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-7/12" />
            <button
              onClick={() => setView('totalDebt')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('monthlySavings')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'totalDebt' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Total household debt
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="totalDebt"
              >
                In total, how much do you owe? (excluding mortgage)
              </label>
              <fieldset>
                {[
                  'less than $40,000',
                  '$40,000 - $74,999',
                  '$75,000 - $99,999',
                  'Over $250,000',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setTotalDebt(value)}
                    currentValue={totalDebt}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-8/12" />
            <button
              onClick={() => setView('houseEquity')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('retirementIncome')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'houseEquity' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Do you have a mortgage?
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold text-sm mb-2 font-nu"
                htmlFor="houseEquity"
              >
                Home equity
              </label>
              <fieldset>
                {[
                  'No, I rent',
                  "Yes, I'm a first time buyer",
                  'Yes, I own my home',
                  'Yes, I own multiple properties',
                ].map((value) => (
                  <RadioOption
                    name="currentAge"
                    value={value}
                    onChange={() => setHouseEquity(value)}
                    currentValue={houseEquity}
                  />
                ))}
              </fieldset>
            </div>
            <ProgressBar width="w-9/12" />
            <button
              onClick={() => setView('postalCode')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('totalDebt')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'postalCode' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Postal Code
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold "
                htmlFor="postalCode"
              >
                First 3 digits of your postal code (eg. L4C)
              </label>
              <input
                onChange={(e) => setPostalCode(e.target.value)}
                name="postalCode"
                type="text"
                className={`border border-1 w-full block p-4 bg-white ${
                  firstName === '' && 'bg-red-50'
                }`}
              />
            </div>
            <ProgressBar width="w-10/12" />
            <button
              disabled={postalCode.length < 3}
              onClick={() => setView('firstName')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('houseEquity')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'firstName' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              What’s your first name?
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold "
                htmlFor="firstName"
              >
                Your First Name
              </label>
              <input
                className={`border border-1 w-full block p-4 bg-white ${
                  firstName === '' && 'bg-red-50'
                }`}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                name="firstName"
                type="text"
              />
            </div>
            <ProgressBar width="w-11/12" />
            <button
              disabled={firstName === ''}
              onClick={() => setView('phoneNumber')}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase"
            >
              Next
            </button>
            <button
              onClick={() => setView('postalCode')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'phoneNumber' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Enter your phone number
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold "
                htmlFor="phoneNumber"
              >
                You'll get a security code
              </label>
              <input
                className={`border border-1 w-full block p-4 bg-white`}
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button
              onClick={handleSignIn}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase disabled:opacity-50"
              disabled={phoneNumber.length < 10 || sendCode}
            >
              {sendCode ? 'Sending...' : 'Send code'}
            </button>
            <button
              onClick={() => setView('firstName')}
              className="text-primary text-md underline"
            >
              Back
            </button>
          </div>
        )}
        {view === 'verifyPhoneNumber' && (
          <div className="flex flex-col gap-10">
            <h2 className="w-full text-4xl font-bold font-montserrat">
              Submit 6 digit verification code
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="w-full block font-semibold "
                htmlFor="phoneNumber"
              >
                Verification code
              </label>
              <input
                className={`border border-1 w-full block p-4 bg-white`}
                value={verificationCode}
                name="phoneNumber"
                type="number"
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerify}
              className="bg-primary text-white p-4 text-xl font-bold disabled:opacity-50 font-montserrat uppercase font-montserrat uppercase"
            >
              Continue
            </button>
            <button
              onClick={() => {
                setSendCode(false);
                setVerifiedFailed(false);
                setView('phoneNumber');
              }}
              className="text-primary text-md underline"
            >
              Try again
            </button>
            {verifiedFailed && (
              <p className="text-red-500 text-center">
                Verification failed. Please try again.
              </p>
            )}
          </div>
        )}

        {view === 'answer' && (
          <p className="pt-4">
            <Answer addPlan={addPlan} text={answer} />
          </p>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
