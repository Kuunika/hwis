import { getDrugs } from "@/services/drugs";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";


export const getAllDrugs = () => {
  const getAll = () =>
    getDrugs().then((response) => response.data);

  return useQuery({
    queryKey: ["drugs"],
    queryFn: () => getAll(),
    enabled: true,
  });
};
