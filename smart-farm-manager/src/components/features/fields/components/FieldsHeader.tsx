"use client";
import {
  ContentHeader,
  ContentHeaderTitle,
  ContentHeaderContent,
  ContentHeaderDescription,
} from "@/components/ui/content-header";
import { AddFieldDrawer } from "./components/AddFieldDrawer";
import { Grid2X2Check } from "lucide-react";

export const FieldsHeader = () => {
  return (
    <ContentHeader className="mb-8 border border-gray-300 dark:border-gray-600 shadow-sm">
      <div className="flex flex-col gap-2">
        <ContentHeaderTitle className="font-semibold text-foreground">
          <Grid2X2Check className="h-5 w-5 text-primary" />
          Farm Field Overview
        </ContentHeaderTitle>
        <ContentHeaderDescription>
          Monitor and manage your farm fields. Track crop performance, analyze
          growth, and optimize farm operations for better yields.
        </ContentHeaderDescription>
      </div>
      <ContentHeaderContent className="gap-2">
        <AddFieldDrawer />
      </ContentHeaderContent>
    </ContentHeader>
  );
};
