import { Equipment } from "@/utils/hooks/api/equipments/types";
export type ActionButton = {
  id: string;
  label: string;
};

export type EquipmentAnalyticsProps = {
  equipments: Equipment[];
  open: boolean;
  onClose: () => void;
};

export type EquipmentsHeaderProps = {
  onViewAnalytics: () => void;
};

export type EditEquipmentsDrawerProps = {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (data: Equipment) => Promise<void>;
};
