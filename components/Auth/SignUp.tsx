'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// import { useAuth, VIEWS } from '@/components/AuthProvider';
import supabase from '@/lib/supabase-browser';
import { Answer } from '../Answer';
import endent from 'endent';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  postalCode: Yup.string().length(3).required('Required'),
  phoneNumber: Yup.string().length(10).required('Required'),
});

const SignUp = () => {
  // const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('retirementAge');
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
  const [houseEquity, setHouseEquity] = useState<string>('No');
  const [answer, setAnswer] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');

  async function signUp(formData: any) {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(
        'Success! Please check your email for further instructions.'
      );
    }
  }

  function ProgressBar({ width }: { width: string }) {
    return (
      <div className="w-full bg-gray-100 h-4 rounded-full">
        <div className={width + ' bg-pink-500 rounded-full h-4'}></div>
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
      <div className="flex items-center mb-4 cursor-pointer" onClick={onChange}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={value === currentValue}
          className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          onChange={onChange}
        />
        <label className="text-sm font-medium ml-2 block">{value}</label>
      </div>
    );
  }

  async function handleSubmitNumber() {
    console.log('retirementAge: ', retirementAge);
    console.log('currentAge: ', currentAge);
    console.log('riskTolerance: ', riskTolerance);
    console.log('dependents: ', dependents);
    console.log('annualIncome: ', annualIncome);
    console.log('totalSavings: ', totalSavings);
    console.log('monthlySavings: ', monthlySavings);
    console.log('retirementIncome: ', retirementIncome);
    console.log('totalDebt: ', totalDebt);
    console.log('houseEquity: ', houseEquity);
    setQuestion('answer');
    const prompt = endent`
    Consider ${firstName}, a Canadian between the ages of ${currentAge} with ${dependents} kids that has an annual income between ${annualIncome}, has between ${totalSavings} in savings and investments, and saves between ${monthlySavings} per month. They'd like between ${retirementIncome} income per year in retirement and they have ${totalDebt} in debt. I asked if they have a mortgage  and they said "${houseEquity}". Can they retire between the ages of ${retirementAge}? Give their likely retirement age in one sentence and list your assumptions after. Be concise and only recommend they speak to a financial advisor at the end. 

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
    console.log(data);
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

  return (
    <div className="w-full p-4 max-w-sm mx-auto">
      <Formik
        initialValues={{
          email: '',
          password: '',
          postalCode: '',
          phoneNumber: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={signUp}
      >
        {({ errors, touched }) => (
          <Form className="column w-full">
            {question === 'retirementAge' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  When would you like to retire?
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="retirementAge"
                  >
                    Your retirement age
                  </label>
                  <fieldset>
                    {['Over 65', '61 - 65', '56 - 60', '51 - 55'].map(
                      (value) => (
                        <RadioOption
                          name="retirementAge"
                          value={value}
                          onChange={() => setRetirementAge(value)}
                          currentValue={retirementAge}
                        />
                      )
                    )}
                  </fieldset>
                </div>
                <button
                  onClick={() => setQuestion('currentAge')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold"
                >
                  Next
                </button>
              </div>
            )}
            {question === 'currentAge' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">How old are you?</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
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

                <ProgressBar width="w-1/12" />
                <button
                  onClick={() => setQuestion('dependents')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('retirementAge')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'dependents' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  How many kids do you have?
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="dependents"
                  >
                    Number of dependent children
                  </label>
                  <fieldset>
                    {['0', '1', '2', '3', '3+'].map((value) => (
                      <RadioOption
                        name="currentAge"
                        value={value}
                        onChange={() => setDependents(value)}
                        currentValue={dependents}
                      />
                    ))}
                  </fieldset>
                </div>
                <ProgressBar width="w-2/12" />
                <button
                  onClick={() => setQuestion('risk')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('currentAge')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'risk' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">Risk Tolerance</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="dependents"
                  >
                    What kind of market ups and downs are you comfortable with?
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
                  onClick={() => setQuestion('annualIncome')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('dependents')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'annualIncome' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Annual household income
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
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
                  onClick={() => setQuestion('totalSavings')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('risk')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'totalSavings' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Total savings and investments
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
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
                  onClick={() => setQuestion('monthlySavings')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('annualIncome')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'monthlySavings' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Total household monthly savings
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="monthlySavings"
                  >
                    In total, how much do you save each month?
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
                  onClick={() => setQuestion('retirementIncome')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('totalSavings')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}

            {question === 'retirementIncome' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Annual household income in retirement
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="retirementIncome"
                  >
                    In total, how much do you need each year for your
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
                  onClick={() => setQuestion('totalDebt')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('monthlySavings')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'totalDebt' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Total household debt
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
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
                  onClick={() => setQuestion('houseEquity')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('retirementIncome')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'houseEquity' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">Home equity</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold text-sm mb-2"
                    htmlFor="houseEquity"
                  >
                    Do you have a mortgage?
                  </label>
                  <fieldset>
                    {[
                      'No',
                      "Yes, I'm a first time buyer",
                      'Yes, I own my home outright',
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
                  onClick={() => setQuestion('postalCode')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('totalDebt')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'postalCode' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">Postal Code</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
                    htmlFor="postalCode"
                  >
                    First 3 digits of your postal code (eg. L4C)
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 bg-white ${
                      errors.postalCode && 'bg-red-50'
                    }`}
                    id="postalCode"
                    name="postalCode"
                    type="text"
                  />
                </div>
                <ProgressBar width="w-10/12" />
                <button
                  disabled={errors.postalCode === undefined ? false : true}
                  onClick={() => setQuestion('firstName')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('houseEquity')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
                {errors.postalCode ? (
                  <div className="text-red-600">{errors.postalCode}</div>
                ) : null}
              </div>
            )}
            {question === 'firstName' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
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
                    className={`border border-1 w-full block rounded-md p-4 bg-white ${
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
                  onClick={() => setQuestion('phoneNumber')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('postalCode')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
              </div>
            )}
            {question === 'phoneNumber' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Enter your phone number
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
                    htmlFor="phoneNumber"
                  >
                    You'll get a security code
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 bg-white`}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                  />
                </div>
                <button
                  onClick={handleSubmitNumber}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setQuestion('firstName')}
                  className="text-pink-500 text-md underline"
                >
                  Back
                </button>
                {errors.phoneNumber ? (
                  <div className="text-red-600">{errors.phoneNumber}</div>
                ) : null}
              </div>
            )}

            {question === 'answer' && (
              <p className="pt-4">
                <Answer text={answer} />
              </p>
            )}

            {question === 'email' && (
              <>
                <label htmlFor="email">Email</label>
                <Field
                  className={`text-green-600 bg-white ${
                    errors.email && 'bg-red-50'
                  }`}
                  id="email"
                  name="email"
                  placeholder="jane@acme.com"
                  type="email"
                />
                {errors.email && touched.email ? (
                  <div className="text-red-600">{errors.email}</div>
                ) : null}
              </>
            )}
            {question === 'password' && (
              <>
                <label htmlFor="password">Password</label>
                <Field
                  className={cn(
                    'input',
                    errors.password && touched.password && 'bg-red-50'
                  )}
                  id="password"
                  name="password"
                  type="password"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-600">{errors.password}</div>
                ) : null}
                <button className="button-inverse w-full" type="submit">
                  Submit
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      {successMsg && <div className="text-black">{successMsg}</div>}
      {/* <button
        className="link w-full"
        type="button"
        onClick={() => setView(VIEWS.SIGN_IN)}
      >
        Already have an account? Sign In.
      </button> */}
    </div>
  );
};

export default SignUp;
