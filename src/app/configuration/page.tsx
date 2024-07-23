import { ApiKeyForm } from "@/components/api-key-form/api-key-form";

export default function ConfigurationPage() {
  return (
    <main className="flex min-h-screen flex-row justify-center p-6">
      <div className="flex flex-col">
        <h1 className="text-5xl font-bold mb-8">Configuration</h1>
        <div className="flex flex-col gap-8">
          <ApiKeyForm
            service="scopus"
            label="Scopus"
            placeholder="Enter Scopus API Key"
            helperText="You can find your API key in the Scopus developer portal."
          />
          <ApiKeyForm
            service="openAI"
            label="Open AI"
            placeholder="Enter Open AI API Key"
            helperText="You can find your API key in the Open AI developer portal."
          />
        </div>
      </div>
    </main>
  );
}
