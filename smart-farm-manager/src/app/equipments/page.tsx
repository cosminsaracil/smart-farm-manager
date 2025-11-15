import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllEquipments } from "@/utils/hooks/api/equipments/useGetEquipment";
import { EquipmentsDashboard } from "@/components/features/equipments";

export default async function Equipments() {
  const queryClient = new QueryClient();

  // Prefetch the results data
  await queryClient.prefetchQuery({
    queryKey: ["equipments"],
    queryFn: getAllEquipments,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EquipmentsDashboard />
    </HydrationBoundary>
  );
}
