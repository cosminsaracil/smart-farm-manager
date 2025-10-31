import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/constants";
import { Farmer } from "./types";

export const getAllFarmers = async (): Promise<Farmer[]> => {
  const response = await fetch(`${BASE_URL}/farmers`);
  if (!response.ok) {
    throw new Error("Failed to fetch farmers");
  }
  return response.json();
};

export const useFarmers = () =>
  useQuery<Farmer[]>({
    queryKey: ["farmers"],
    queryFn: getAllFarmers,
  });
