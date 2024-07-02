import { getVisitNumber } from "@/services/visitNumberService";
import { useQuery } from "@tanstack/react-query";

export const getVisitNum = () => {
  const getNumber = () => getVisitNumber().then((response) => response.data);

  return useQuery({
    queryKey: ["visitNumber"],
    queryFn: getNumber,
    enabled: false,
  });
};
