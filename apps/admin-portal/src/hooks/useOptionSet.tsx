import { createOptionSetService } from "@/services";
import { useQuery } from "@tanstack/react-query";

const getOptionSets = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createOptionSetService()
      .getAll()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["optionSets"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useOptionSet = { getOptionSets };
