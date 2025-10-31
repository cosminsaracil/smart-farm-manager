"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const FarmerHeader = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Farmers Management</h1>
        <p className="text-gray-600">Manage all your farmers here</p>
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
