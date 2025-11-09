"use client";

import { useState } from "react";
import { CropsHeader } from "./components/CropsHeader";
// import { FieldsBody } from "./components/FieldsBody";
// import { FieldsAnalytics } from "./components/FieldsAnalytics";
import ContentWrapper from "@/components/ui/content-wrapper";
import { useGetCrops } from "@/utils/hooks/api/crops/useGetCrops";
import { LoadingSpinner } from "@/components/ui/Spinner/Spiner";
import { ErrorPage } from "@/components/ui/Error/ErrorPage";
import { Crop } from "lucide-react";

export const CropsDashboard = () => {
  const { data, isFetching, error, refetch } = useGetCrops();
  console.log("Crops data:", data);
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
      <CropsHeader />
      {/* <FieldsHeader onViewAnalytics={() => setAnalyticsOpen(true)} /> */}
      {/* <FieldsBody data={data || []} /> */}
      {/* <FieldsAnalytics
        fields={data || []}
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      /> */}
    </ContentWrapper>
  );
};
