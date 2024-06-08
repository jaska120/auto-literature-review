"use client";

import { useState } from "react";
import { Search } from "./search";
import { Step2 } from "./step2";
import { Step3 } from "./step3";

export function MultiStepForm() {
  const [step, setStep] = useState(0);

  const Steps = [Search, Step2, Step3];

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-6">Steps</h1>
      <div className="flex flex-col">
        <div className="flex justify-between mb-8">
          {Steps.map((Component, index) => (
            <button key={`${Component.name}-button`} onClick={() => setStep(index)} type="button">
              {Component.name}
            </button>
          ))}
        </div>
        <div>
          {Steps.map(
            (Component, index) => step === index && <Component key={`${Component.name}-step`} />
          )}
        </div>
      </div>
    </div>
  );
}
