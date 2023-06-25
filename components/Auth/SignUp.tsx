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
  retirementAge: Yup.number().required('Required'),
  currentAge: Yup.number().required('Required'),
  firstName: Yup.string().required('Required'),
  dependents: Yup.number().required('Required'),
  annualIncome: Yup.string().required('Required'),
});

const SignUp = () => {
  // const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('retirementAge');
  const [riskTolerance, setRiskTolerance] = useState<string>('50');

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
          retirementAge: 65,
          currentAge: '',
          firstName: '',
          dependents: 0,
          annualIncome: '',
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
                    className="w-full block font-semibold "
                    htmlFor="retirementAge"
                  >
                    Your retirement age
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.retirementAge && 'bg-red-50'
                    }`}
                    id="retirementAge"
                    name="retirementAge"
                    type="number"
                  />
                </div>
                <button
                  onClick={() => setQuestion('currentAge')}
                  className="bg-pink-500 text-white p-4 rounded-full text-xl font-bold"
                >
                  Next
                </button>
                {errors.retirementAge ? (
                  <div className="text-red-600">{errors.retirementAge}</div>
                ) : null}
              </div>
            )}

            {question === 'currentAge' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">How old are you?</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
                    htmlFor="currentAge"
                  >
                    Your age
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.currentAge && 'bg-red-50'
                    }`}
                    id="currentAge"
                    name="currentAge"
                    type="number"
                  />
                </div>
                <ProgressBar width="w-1/12" />
                <button
                  disabled={errors.currentAge === undefined ? false : true}
                  onClick={() => setQuestion('firstName')}
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
                {errors.currentAge ? (
                  <div className="text-red-600">{errors.currentAge}</div>
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
                <ProgressBar width="w-2/12" />
                <button
                  disabled={errors.firstName === undefined ? false : true}
                  onClick={() => setQuestion('dependents')}
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
                {errors.firstName ? (
                  <div className="text-red-600">{errors.firstName}</div>
                ) : null}
              </div>
            )}

            {question === 'dependents' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  How many kids do you have?
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
                    htmlFor="dependents"
                  >
                    Number of dependent children
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.dependents && 'bg-red-50'
                    }`}
                    id="dependents"
                    name="dependents"
                    type="number"
                  />
                </div>
                <ProgressBar width="w-3/12" />
                <button
                  disabled={errors.dependents === undefined ? false : true}
                  onClick={() => setQuestion('risk')}
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
                {errors.dependents ? (
                  <div className="text-red-600">{errors.dependents}</div>
                ) : null}
              </div>
            )}

            {question === 'risk' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">Risk Tolerance</h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
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
                <ProgressBar width="w-4/12" />
                <button
                  disabled={errors.dependents === undefined ? false : true}
                  onClick={() => setQuestion('annualIncome')}
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
                {errors.dependents ? (
                  <div className="text-red-600">{errors.dependents}</div>
                ) : null}
              </div>
            )}

            {question === 'annualIncome' && (
              <div className="flex flex-col gap-10">
                <h2 className="w-full text-4xl font-bold ">
                  Annual household income
                </h2>
                <div className="flex flex-col gap-2">
                  <label
                    className="w-full block font-semibold "
                    htmlFor="annualIncome"
                  >
                    Your gross household income (before taxes)
                  </label>
                  <Field
                    className={`border border-1 w-full block rounded-md p-4 ${
                      errors.annualIncome && 'bg-red-50'
                    }`}
                    id="annualIncome"
                    name="annualIncome"
                    type="text"
                  />
                </div>
                <ProgressBar width="w-5/12" />
                <button
                  disabled={errors.annualIncome === undefined ? false : true}
                  onClick={() => setQuestion('dependents')}
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
                {errors.annualIncome ? (
                  <div className="text-red-600">{errors.annualIncome}</div>
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
