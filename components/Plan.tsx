'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type PlanProps = {
  userId: string;
};

export const Plan = ({ userId }: PlanProps) => {
  const [plans, setPlans] = useState<any>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: plans, error } = await supabase
        .from('Plans')
        .select('*')
        .eq('userId', userId)
        .order('id', { ascending: false });

      if (error) console.log('error', error);
      else setPlans(plans);
    };

    fetchTodos();
  }, [supabase]);

  return (
    <div className="whitespace-pre-line">
      <div className="w-full max-w-sm mx-auto py-6">{plans[0]?.plan}</div>
    </div>
  );
};
