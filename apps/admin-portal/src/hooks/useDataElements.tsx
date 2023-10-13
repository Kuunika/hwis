import { DataElement, createDataElementService } from "@/services";
import { useQuery } from "@tanstack/react-query";

const getDataElements = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createDataElementService()
      .getAll<DataElement>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["dataElements"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useDataElements = () => ({ getDataElements });
