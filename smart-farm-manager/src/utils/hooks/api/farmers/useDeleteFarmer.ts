import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";

async function deleteFarmer(id: string) {
  return apiClient(`/farmers?id=${id}`, { method: "DELETE" });
}

export function useDeleteFarmer() {
  return useMutation({ mutationFn: deleteFarmer });
}
