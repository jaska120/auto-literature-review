import { ScopusApiKeyForm } from "./scopus-api-key-form";

export default function ConfigurationPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-5xl font-bold mb-8">Configuration</h1>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Scopus API Key</h2>
          <ScopusApiKeyForm />
        </div>
      </div>
    </main>
  );
}
