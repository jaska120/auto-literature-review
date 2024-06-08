import Changelog from "../../../CHANGELOG.md";

export default function ChangelogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-8">Changelog</h1>
        <div className="prose prose-lg dark:prose-dark">
          <Changelog />
        </div>
      </div>
    </main>
  );
}
