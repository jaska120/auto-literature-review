"use client";

import { useBoundStore } from "@/state/bound-store";
import { useShallow } from "zustand/react/shallow";

export default function SystemPromptsPage() {
  const state = useBoundStore(useShallow((s) => ({ searchString: s.searchStringSystemPrompt })));
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-bold mb-8">System Prompts</h1>
        <p className="mb-4">
          These are the current system prompts designed to guide AI in specific tasks.
        </p>
        <h2 id="search-string" className="text-2xl font-bold mb-6">
          Search String
        </h2>
        <p>{state.searchString}</p>
      </div>
    </main>
  );
}
