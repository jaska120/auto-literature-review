import { ApiKeyForm } from "@/components/api-key-form/api-key-form";
import { StoreLoading } from "@/components/loading/store-loading";

export default function ConfigurationPage() {
  return (
    <main className="min-h-full flex flex-row justify-center p-6">
      <div className="flex flex-col">
        <h1 className="text-5xl font-bold mb-8">Configuration</h1>
        <div className="flex flex-col gap-8">
          <StoreLoading>
            <ApiKeyForm
              service="scopus"
              keys={[
                {
                  label: "Scopus API key",
                  placeholder: "Enter Scopus API Key",
                  helperText: "You can find your API key in the Elsevier developer portal.",
                },
                {
                  label: "Scopus Institutional Token",
                  placeholder: "Enter Scopus Institutional Token",
                  helperText: "You must request this token from Elsevier support.",
                },
              ]}
            />
            <ApiKeyForm
              service="openAI"
              keys={[
                {
                  label: "Open AI API key",
                  placeholder: "Enter Open AI API Key",
                  helperText: "You can find your API key in the Open AI developer portal.",
                },
              ]}
            />
          </StoreLoading>
        </div>
      </div>
    </main>
  );
}
