import { ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "@/components/ui/Table/data-table";
import { ActionButton } from "./types";
import type { Farmer } from "@/utils/hooks/api/farmers/types";

export const FarmerBody = ({ data }: { data: Farmer[] }) => {
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

  const actionButtons = [{ id: "view", label: "View" }];

  const handleMoreMenu = (row: Farmer, action: ActionButton) => {
    const { label } = action;

    switch (label.toLowerCase()) {
      case "view":
        console.log("Viewing farmer:", row);
      default:
        return null;
    }
  };

  return (
    <GenericTable
      title="Users"
      data={data}
      columns={columns}
      actionButtons={actionButtons}
      onActionClick={handleMoreMenu}
      showPagination
      showSearch
    />
  );
};
