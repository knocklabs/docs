export function ResourceSectionSkeleton() {
  return (
    <div className="py-16 border-b border-gray-200">
      <div className="flex flex-col gap-4">
        <div
          className="h-8 bg-gray-200 rounded animate-pulse"
          style={{ width: "200px" }}
        />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div
          className="h-4 bg-gray-100 rounded animate-pulse"
          style={{ width: "75%" }}
        />
        <div className="flex flex-row gap-4 mt-4">
          <div
            className="h-32 bg-gray-100 rounded animate-pulse"
            style={{ width: "50%" }}
          />
          <div
            className="h-32 bg-gray-100 rounded animate-pulse"
            style={{ width: "50%" }}
          />
        </div>
      </div>
    </div>
  );
}
