"use client";
import { useFarmers } from "@/utils/hooks/api/farmers/useGetFarmers";
export const FarmersDashboard = () => {
  const { data: farmers, isLoading, isError } = useFarmers();

  if (isLoading) return <div>Loading farmers...</div>;
  if (isError) return <div>Error loading farmers.</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8">All farmers page</h1>
      <ul className="w-full max-w-2xl">
        {farmers?.map((farmer) => (
          <li
            key={farmer._id}
            className="border-b border-gray-300 py-4 flex justify-between"
          >
            <span className="font-medium">{farmer.name}</span>
            <span className="text-gray-600">{farmer.email}</span>
          </li>
        ))}
      </ul>
    </main>
  );
};
