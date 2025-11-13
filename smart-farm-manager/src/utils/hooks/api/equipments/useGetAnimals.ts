import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { Equipment } from "./types";

export const getAllEquipments = async (): Promise<Equipment[]> =>
  apiClient<Equipment[]>("/equipments");

export const useGetEquipments = () =>
  useQuery({
    queryKey: ["equipments"],
    queryFn: getAllEquipments,
  });
