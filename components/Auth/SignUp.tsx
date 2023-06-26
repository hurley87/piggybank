'use client';

import { useState } from 'react';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// import { useAuth, VIEWS } from '@/components/AuthProvider';
import supabase from '@/lib/supabase-browser';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
  postalCode: Yup.string().length(3).required('Required'),
  phoneNumber: Yup.string().length(10).required('Required'),
});

const SignUp = () => {
  // const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('retirementAge');
  const [retirementAge, setRetirementAge] = useState<string>('65');
  const [currentAge, setCurrentAge] = useState<string>('40');
  const [riskTolerance, setRiskTolerance] = useState<string>('50');
  const [dependents, setDependents] = useState<string>('2');
  const [annualIncome, setAnnualIncome] = useState<string>('200');
  const [totalSavings, setTotalSavings] = useState<string>('2');
  const [monthlySavings, setMonthlySavings] = useState<string>('2');
  const [retirementIncome, setRetirementIncome] = useState<string>('2');
  const [totalDebt, setTotalDebt] = useState<string>('2');
  const [houseEquity, setHouseEquity] = useState<string>('2');

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

  return (
    <div className="w-full p-4 max-w-sm mx-auto">
      <Formik
        initialValues={{
          email: '',
          password: '',
          firstName: '',
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="retirementAge"
                  >
                    Your retirement age
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setRetirementAge(e.target.value)}
                    min={60}
                    max="70"
                    value={retirementAge}
                    className="range range-primary mt-4"
                    step="5"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>Under 60</span>
                    <span></span>
                    <span>65</span>
                    <span></span>
                    <span>Over 70</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="currentAge"
                  >
                    Your age
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setCurrentAge(e.target.value)}
                    min={30}
                    max="50"
                    value={currentAge}
                    className="range range-primary mt-4"
                    step="10"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>30s</span>
                    <span></span>
                    <span>40s</span>
                    <span></span>
                    <span>50s</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="dependents"
                  >
                    Number of dependent children
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setDependents(e.target.value)}
                    min={0}
                    max="4"
                    value={dependents}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>3+</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="annualIncome"
                  >
                    Your gross household income (before taxes)
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    min={100}
                    max="300"
                    value={annualIncome}
                    className="range range-primary mt-4"
                    step="100"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>{'<'} $100K</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $300K</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="totalSavings"
                  >
                    In total, how much do you have in savings and investments?
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setTotalSavings(e.target.value)}
                    min={1}
                    max="3"
                    value={totalSavings}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>0</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $500K</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="monthlySavings"
                  >
                    In total, how much do you save each month?
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    min={1}
                    max="3"
                    value={monthlySavings}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>0</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $2K</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="retirementIncome"
                  >
                    In total, how much do you plan to make each year in your
                    retirement?
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setRetirementIncome(e.target.value)}
                    min={1}
                    max="3"
                    value={retirementIncome}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>0</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $200K</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="totalDebt"
                  >
                    In total, how much do you owe? (excluding mortgage)
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setTotalDebt(e.target.value)}
                    min={1}
                    max="3"
                    value={totalDebt}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>0</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $200K</span>
                  </div>
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
                    className="w-full block font-semibold text-sm"
                    htmlFor="houseEquity"
                  >
                    How much equity do you have in your home?
                  </label>
                  <input
                    type="range"
                    onChange={(e) => setHouseEquity(e.target.value)}
                    min={1}
                    max="3"
                    value={houseEquity}
                    className="range range-primary mt-4"
                    step="1"
                  />
                  <div className="w-full flex justify-between text-xs px-2">
                    <span>Don't own</span>
                    <span></span>
                    <span>Somewhere in between</span>
                    <span></span>
                    <span>{'>'} $500K</span>
                  </div>
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
                    className={`border border-1 w-full block rounded-md p-4 ${
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
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.firstName && 'bg-red-50'
                    }`}
                    id="firstName"
                    name="firstName"
                    type="text"
                  />
                </div>
                <ProgressBar width="w-11/12" />
                <button
                  disabled={errors.firstName === undefined ? false : true}
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
                {errors.firstName ? (
                  <div className="text-red-600">{errors.firstName}</div>
                ) : null}
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
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.phoneNumber && 'bg-red-50'
                    }`}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                  />
                </div>
                <button
                  disabled={errors.phoneNumber === undefined ? false : true}
                  onClick={() => setQuestion('phoneNumber')}
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

            {question === 'email' && (
              <>
                <label htmlFor="email">Email</label>
                <Field
                  className={`bg-green-200 text-green-600 ${
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
