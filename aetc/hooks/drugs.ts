import { getDrugs } from "@/services/drugs";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";


export const getAllDrugs = () => {
  const getAll = async () => {
    const response = await getDrugs();
    return response.data;
  };

  return useQuery({
    queryKey: ["drugs"],
    queryFn: getAll,
    enabled: true,
  });
};
