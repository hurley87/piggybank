'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const Plan: React.FC = () => {
  const [plans, setPlans] = useState<any>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: plans, error } = await supabase
        .from('Plans')
        .select('*')
        .order('id', { ascending: false });

      if (error) console.log('error', error);
      else setPlans(plans);
    };

    fetchTodos();
  }, [supabase]);

  console.log(plans);

  return (
    <div className="whitespace-pre-line pb-20">
      <div className="w-full p-4 max-w-sm mx-auto">{plans[0]?.plan}</div>
    </div>
  );
};
