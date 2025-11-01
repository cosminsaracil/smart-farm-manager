"use client";
import { Button } from "@/components/ui/button";
import {
  ContentHeader,
  ContentHeaderTitle,
  ContentHeaderContent,
} from "@/components/ui/content-header";
import { Plus } from "lucide-react";

export const FarmerHeader = () => {
  return (
    <ContentHeader className="mb-8">
      <div>
        <ContentHeaderTitle>Manage all your users here</ContentHeaderTitle>
      </div>
      <ContentHeaderContent>
        <Button
          variant={"ghost"}
          onClick={() => console.log("Add farmer button clicked")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Add Farmer
        </Button>
      </ContentHeaderContent>
    </ContentHeader>
  );
};
