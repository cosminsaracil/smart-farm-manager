import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/constants";
import { FarmerPayload } from "./types";

async function addFarmer(data: FarmerPayload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create farmer");
  return res.json();
}

export function useAddFarmer() {
  return useMutation({
    mutationFn: addFarmer,
  });
}
