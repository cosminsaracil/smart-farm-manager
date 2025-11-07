"use client";

import { FieldsHeader } from "./components/FieldsHeader";
import { FieldsBody } from "./components/FieldsBody";
import ContentWrapper from "@/components/ui/content-wrapper";
import { useGetFields } from "@/utils/hooks/api/fields/useGetFields";
import { LoadingSpinner } from "@/components/ui/Spinner/Spiner";
import { ErrorPage } from "@/components/ui/Error/ErrorPage";

export const FieldsDashboard = () => {
  const { data, isFetching, error, refetch } = useGetFields();
  console.log("Fields data:", data);

  if (isFetching) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorPage
        message="Failed to load farmers data."
        onRetry={() => refetch()}
      />
    );

  return (
    <ContentWrapper>
      <FieldsHeader />
      <FieldsBody data={data || []} />
    </ContentWrapper>
  );
};
