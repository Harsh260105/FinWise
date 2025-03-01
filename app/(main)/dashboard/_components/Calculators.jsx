'use client';

import dynamic from 'next/dynamic';

const EMICalculator = dynamic(() => import("./EMICalculator"), { ssr: false });
const CAGRCalculator = dynamic(() => import("./CAGRCalculator"), { ssr: false });

export default function Calculators() {
  return (
    <>
      <EMICalculator />
      <CAGRCalculator />
    </>
  );
} 