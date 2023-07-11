'use client';

import React, { useEffect, useState } from 'react';
import styles from './answer.module.css';
import { useRouter } from 'next/navigation';
import va from '@vercel/analytics';

interface AnswerProps {
  text: string;
  addPlan: (plan: string) => Promise<void>;
}

export const Answer: React.FC<AnswerProps> = ({ text, addPlan }) => {
  const [words, setWords] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  // show login after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogin(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  async function updateUser() {
    const plan = words.join(' ');

    await addPlan(plan);

    va.track('CreatePlan');

    router.refresh();
  }

  return (
    <div className="whitespace-pre-line	pb-20 font-nunito">
      {words.map((word, index) => (
        <span
          key={index}
          className={styles.fadeIn}
          style={{ animationDelay: `${index * 0.001}s` }}
        >
          {word}{' '}
        </span>
      ))}
      {showLogin && (
        <button
          onClick={updateUser}
          className="bg-primary text-white p-4 text-xl font-bold duration-200 w-full block text-center mt-4 font-montserrat uppercase"
        >
          Continue
        </button>
      )}
    </div>
  );
};
