"use client";

import { useState } from "react";
import { Search } from "./search";
import { Step2 } from "./step2";
import { Step3 } from "./step3";

export function MultiStepForm() {
  const [step, setStep] = useState(0);

  const Steps: { component: () => JSX.Element; button: string }[] = [
    { component: Search, button: "Search" },
    { component: Step2, button: "Step 2" },
    { component: Step3, button: "Step 3" },
  ];

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-6">Steps</h1>
      <div className="flex flex-col">
        <div className="flex justify-between mb-8">
          {Steps.map(({ component: Component, button }, index) => (
            <button key={`${Component.name}-button`} onClick={() => setStep(index)} type="button">
              {button}
            </button>
          ))}
        </div>
        {Steps.map(({ component: Component }, index) => (
          <div key={`${Component.name}-step`} className={step === index ? "block" : "hidden"}>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
