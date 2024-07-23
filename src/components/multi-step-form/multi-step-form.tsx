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
    <div>
      <h2 className="sr-only">Steps</h2>
      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg">
        <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
          {Steps.map(({ component: Component, button }, index) => {
            const active = step === index;

            return (
              <li key={`${Component.name}-item`} className="flex items-center p-2">
                <button
                  key={`${Component.name}-button`}
                  className="flex items-center gap-2"
                  onClick={() => setStep(index)}
                  type="button"
                >
                  <span
                    className={`size-6 rounded-full text-center text-[10px]/6 font-bold ${active ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden sm:block"> {button} </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="py-8">
        {Steps.map(({ component: Component }, index) => (
          <div key={`${Component.name}-step`} className={step === index ? "block" : "hidden"}>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
