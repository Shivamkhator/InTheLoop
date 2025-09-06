// components/ui/AuthButtonsSkeleton.tsx

export const AuthButtonsSkeleton = () => {

  return (
    <div className="flex items-center gap-4 mr-2">
      <div className="h-9 w-28 animate-pulse rounded-md bg-gray-200" />
      <div className="h-9 w-18 animate-pulse rounded-md bg-gray-300" />
    </div>
  );
};