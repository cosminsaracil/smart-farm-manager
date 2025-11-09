"use client";

import { useState } from "react";
import { CropsHeader } from "./components/CropsHeader";
import { CropsBody } from "./components/CropsBody";
import { CropsAnalytics } from "./components/CropsAnalytics";
import ContentWrapper from "@/components/ui/content-wrapper";
import { useGetCrops } from "@/utils/hooks/api/crops/useGetCrops";
import { LoadingSpinner } from "@/components/ui/Spinner/Spiner";
import { ErrorPage } from "@/components/ui/Error/ErrorPage";

export const CropsDashboard = () => {
  const { data, isFetching, error, refetch } = useGetCrops();
  console.log("Crops data:", data);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

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
      <CropsHeader />
      <CropsBody data={data || []} />
      {/* <CropsAnalytics data={data || []} /> */}
    </ContentWrapper>
  );
};
