'use client';

import { useEffect, useRef, useState } from 'react';
import type { LottiePlayer } from 'lottie-web';

const PiggyBank = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets4.lottiefiles.com/packages/lf20_yvwcdrrw.json',
      });
    }
  }, [lottie]);

  return <div className="max-w-xs mx-auto" ref={ref} />;
};

export default PiggyBank;
