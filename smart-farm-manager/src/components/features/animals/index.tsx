"use client";

import { useState } from "react";
import { AnimalsHeader } from "./components/AnimalsHeader";
import ContentWrapper from "@/components/ui/content-wrapper";
import { useGetAnimals } from "@/utils/hooks/api/animals/useGetAnimals";
import { LoadingSpinner } from "@/components/ui/Spinner/Spiner";
import { ErrorPage } from "@/components/ui/Error/ErrorPage";

export const AnimalsDashboard = () => {
  const { data, isFetching, error, refetch } = useGetAnimals();
  // const [analyticsOpen, setAnalyticsOpen] = useState(false);

  if (isFetching) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorPage
        message="Failed to load fields data."
        onRetry={() => refetch()}
      />
    );

  return (
    <ContentWrapper>
      {/* <CropsHeader onViewAnalytics={() => setAnalyticsOpen(true)} /> */}
      <AnimalsHeader />
      {/* <CropsBody data={data || []} /> */}
      {/* <CropsAnalytics
        crops={data || []}
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      /> */}
    </ContentWrapper>
  );
};
