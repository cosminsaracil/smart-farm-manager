import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { Farmer, FarmerPayload } from "./types";

async function addFarmer(data: FarmerPayload): Promise<Farmer> {
  return apiClient<Farmer>("/farmers", {
    method: "POST",
    body: data,
  });
}

export function useAddFarmer(): UseMutationResult<
  Farmer, // Type of returned data
  Error, // Type of error
  FarmerPayload // Type of variables you pass to mutate()
> {
  return useMutation({
    mutationFn: addFarmer,
  });
}

// Benefits of this hook:

// const addFarmer = useAddFarmer();

// addFarmer.mutate({
//   name: "Ion Popescu",
//   email: "ion@ferma.ro",
//   password: "12345",
//   role: "admin",
// });
