export function Loading() {
  return (
    <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600 h-full animate-loading" />
    </div>
  );
}
