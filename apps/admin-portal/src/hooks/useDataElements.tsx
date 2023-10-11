import { createOptionSetService } from "@/services";
import { useQuery } from "@tanstack/react-query";

const getDataElementsSets = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createOptionSetService()
      .getAll()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["dataElements"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useDataElements = { getDataElementsSets };
