export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="h-12 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-96 bg-gray-100 rounded animate-pulse" />
        <div className="flex flex-col gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 w-full bg-gray-100 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
