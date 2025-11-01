"use client";
import { Button } from "@/components/ui/button";
import {
  ContentHeader,
  ContentHeaderTitle,
  ContentHeaderContent,
  ContentHeaderDescription,
} from "@/components/ui/content-header";
import { Plus, Users } from "lucide-react";

export const FarmerHeader = () => {
  return (
    <ContentHeader className="mb-8 border border-border shadow-sm">
      <div className="flex flex-col gap-2">
        <ContentHeaderTitle className="font-semibold text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Farmers Management
        </ContentHeaderTitle>
        <ContentHeaderDescription>
          View, manage, and organize all registered farmers in your network.
          Track their activities and maintain up-to-date records.
        </ContentHeaderDescription>
      </div>
      <ContentHeaderContent className="gap-2">
        <Button
          onClick={() => console.log("Add farmer button clicked")}
          className="flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} />
          Add Farmer
        </Button>
      </ContentHeaderContent>
    </ContentHeader>
  );
};
