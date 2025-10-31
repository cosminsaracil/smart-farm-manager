import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Farmer, FarmerPayload } from "./types";
import { apiClient } from "../../apiClient";
async function updateFarmer(data: FarmerPayload): Promise<Farmer> {
  return apiClient<Farmer>("/farmers", {
    method: "PUT",
    body: data,
  });
}

export function useUpdateFarmer(): UseMutationResult<
  Farmer,
  Error,
  FarmerPayload
> {
  return useMutation({
    mutationFn: updateFarmer,
  });
}
