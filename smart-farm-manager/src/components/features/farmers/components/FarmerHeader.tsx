"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const FarmerHeader = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">Manage all your users here</h1>
      </div>
      <Button
        variant={"ghost"}
        onClick={() => console.log("Add farmer button clicked")}
        className="flex items-center gap-2"
      >
        <Plus size={18} />
        Add Farmer
      </Button>
    </header>
  );
};
