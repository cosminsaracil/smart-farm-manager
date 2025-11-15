import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query";
import { Equipment, UpdateEquipmentPayload } from "./types";
import { apiClient } from "../../apiClient";
async function updateEquipment(
  data: UpdateEquipmentPayload
): Promise<Equipment> {
  return apiClient<Equipment>("/equipments", {
    method: "PUT",
    body: data,
  });
}

export function useUpdateEquipment(
  options?: UseMutationOptions<Equipment, Error, UpdateEquipmentPayload>
): UseMutationResult<Equipment, Error, UpdateEquipmentPayload> {
  return useMutation({
    mutationFn: updateEquipment,
    ...options,
  });
}
