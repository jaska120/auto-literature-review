"use client";

import { Fragment } from "react";
import { CaretRightIcon } from "@/components/icon/caret-right-icon";
import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";
import { Search } from "./search";
import { SearchString } from "./search-string";
import { Evaluate } from "./evaluate";
import { Write } from "./write";

const Steps: { component: () => JSX.Element; title: string }[] = [
  { component: SearchString, title: "Search String" },
  { component: Search, title: "Literature Search" },
  { component: Evaluate, title: "Evaluate Literature" },
  { component: Write, title: "Write Literature Review" },
];

export function MultiStepForm() {
  const [step, setStep] = useBoundStore(useShallow((s) => [s.flowStep, s.setFlowStep]));
  const applyFn = useBoundStore(useShallow((s) => [s.applySearchString]));

  const handleToNextStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleApplyToNextStep = (currentStep: number) => {
    applyFn[currentStep]();
    handleToNextStep(currentStep + 1);
  };

  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      <div className="relative flex items-center justify-between w-full text-sm font-medium text-gray-500">
        <ol className="relative flex items-center w-full">
          {Steps.map(({ component: Component, title }, index) => {
            const active = step === index;

            return (
              <Fragment key={`${Component.name}-fragment`}>
                <li className="flex flex-col items-center text-center w-full">
                  <div className="flex flex-col items-center">
                    <button
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-100"
                      }`}
                      onClick={() => handleToNextStep(index)}
                      type="button"
                    >
                      {index + 1}
                    </button>
                    <span className="text-xs mt-1">{title}</span>
                  </div>
                </li>

                {index < Steps.length - 1 && (
                  <li className="flex flex-col items-center w-full">
                    <div className="flex items-center w-full">
                      <div className="h-0.5 w-full bg-gray-300" />
                      <button
                        onClick={() => handleApplyToNextStep(index)}
                        type="button"
                        className={`flex items-center gap-2 border p-2 rounded-lg shadow-sm transition-all duration-200 mx-2 ${
                          active
                            ? "border-blue-600 text-blue-600 hover:bg-blue-100"
                            : "border-gray-300 text-gray-400"
                        }`}
                        disabled={!active}
                      >
                        <span className="hidden sm:block">Apply</span>
                        <CaretRightIcon className="w-4 h-4" />
                      </button>
                      <div className="h-0.5 w-full bg-gray-300" />
                    </div>
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </div>

      <div className="py-8">
        {Steps.map(({ component: Component, title }, index) => (
          <div key={`${Component.name}-step`} className={step === index ? "block" : "hidden"}>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
