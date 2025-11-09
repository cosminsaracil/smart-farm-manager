import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllCrops } from "@/utils/hooks/api/crops/useGetCrops";
// import { FieldsDashboard } from "@/components/features/fields";
export default async function Crops() {
  const queryClient = new QueryClient();

  // Prefetch the results data
  await queryClient.prefetchQuery({
    queryKey: ["crops"],
    queryFn: getAllCrops,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <FieldsDashboard /> */}
      <h1>helllo</h1>
    </HydrationBoundary>
  );
}
