"use client";

import { useState } from "react";
import { EquipmentsHeader } from "./components/EquipmentsHeader";
import ContentWrapper from "@/components/ui/content-wrapper";
import { useGetEquipments } from "@/utils/hooks/api/equipments/useGetAnimals";
import { LoadingSpinner } from "@/components/ui/Spinner/Spiner";
import { ErrorPage } from "@/components/ui/Error/ErrorPage";

export const EquipmentsDashboard = () => {
  const { data, isFetching, error, refetch } = useGetEquipments();
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  if (isFetching) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorPage
        message="Failed to load equipments data."
        onRetry={() => refetch()}
      />
    );

  return (
    <ContentWrapper>
      <EquipmentsHeader onViewAnalytics={() => setAnalyticsOpen(true)} />
      {/* <FarmerBody data={data || []} /> */}
    </ContentWrapper>
  );
};
