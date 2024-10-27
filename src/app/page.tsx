import { StoreLoading } from "@/components/loading/store-loading";
import { MultiStepForm } from "@/components/multi-step-form/multi-step-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row justify-center p-6">
      <div className="w-full max-w-7xl">
        <StoreLoading>
          <MultiStepForm />
        </StoreLoading>
      </div>
    </main>
  );
}
