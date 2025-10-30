import { QueryClient } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function HomePage() {
  const queryClient = new QueryClient();
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h2 className="text-3xl font-bold mb-4">
          Welcome to Smart Farm Manager
        </h2>
      </HydrationBoundary>
    </div>
  );
}
