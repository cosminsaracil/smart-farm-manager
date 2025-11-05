import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { GenericTable } from "@/components/ui/Table/data-table";
import { EditFarmerDrawer } from "./EditFarmerDrawer";
import { useUpdateFarmer } from "@/utils/hooks/api/farmers/usePatchFarmer";
import { useDeleteFarmer } from "@/utils/hooks/api/farmers/useDeleteFarmer";
import { ActionButton } from "./types";
import type {
  Farmer,
  UpdateFarmerPayload,
} from "@/utils/hooks/api/farmers/types";

export const FarmerBody = ({ data }: { data: Farmer[] }) => {
  const queryClient = useQueryClient();
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  // Update farmer mutation
  const updateFarmerMutation = useUpdateFarmer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast.success("Farmer updated successfully!", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    },

    onError: (error) => {
      console.error("Error updating farmer:", error);
      toast.error("Failed to update farmer. Please try again.", {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  const handleUpdateFarmer = async (data: Farmer) => {
    const payload: UpdateFarmerPayload = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
    };
    if (data.password) payload.password = data.password;

    await updateFarmerMutation.mutateAsync(payload);
    setEditDrawerOpen(false);
  };

  const columns: ColumnDef<Farmer>[] = [
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 150,
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 200,
    },
  ];

  const actionButtons = [
    { id: "view", label: "View" },
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete" },
  ];

  const handleMoreMenu = (row: Farmer, action: ActionButton) => {
    const { label } = action;
    switch (label.toLowerCase()) {
      case "view":
        console.log("Viewing farmer:", row);
        break;
      case "edit":
        console.log("Editing farmer:", row);
        setSelectedFarmer(row);
        setEditDrawerOpen(true);
        break;
      case "delete":
        console.log("Deleting farmer:", row);
        // Handle delete action
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <GenericTable
        title="Users"
        data={data}
        columns={columns}
        actionButtons={actionButtons}
        onActionClick={handleMoreMenu}
        showPagination
        showSearch
      />

      {selectedFarmer && (
        <EditFarmerDrawer
          farmer={selectedFarmer}
          open={editDrawerOpen}
          onOpenChange={setEditDrawerOpen}
          onUpdate={handleUpdateFarmer}
        />
      )}
    </>
  );
};
