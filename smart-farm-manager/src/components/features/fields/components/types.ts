import type { Field } from "@/utils/hooks/api/fields/types";

export type ActionButton = {
  id: string;
  label: string;
};

export type FieldsAnalyticsProps = {
  fields: Field[];
  open: boolean;
  onClose: () => void;
};
