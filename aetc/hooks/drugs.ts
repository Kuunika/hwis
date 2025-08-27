import { getDrugs, getRegimenNames } from "@/services/drugs";
import { useQuery } from "@tanstack/react-query";


export const getAllDrugs = () => {
  const getAll = async () => {
    const response = await getDrugs();
    return response.data;
  };

  return useQuery({
    queryKey: ["drugs"],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    refetchOnReconnect: false,
  });
};
export const getAllRegimenNames = () => {
  const getAll = async () => {
    const response = await getRegimenNames();
    return response.data;
  };

  return useQuery({
    queryKey: ["regimenNames"],
    queryFn: getAll,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    refetchOnReconnect: false,
  });
};
