import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllTransactions } from "@/utils/hooks/api/transactions/useGetTransaction";
export default async function Transactions() {
  const queryClient = new QueryClient();

  // Prefetch the results data
  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  return <HydrationBoundary state={dehydrate(queryClient)}></HydrationBoundary>;
}
