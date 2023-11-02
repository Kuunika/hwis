import { OptionSet, createOptionSetService } from "@/services";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getOptionSets = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createOptionSetService()
      .getAll<OptionSet>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["optionSets"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useAddOptionSet = () => {
  const queryClient = useQueryClient();
  const addData = (optionSet: any) =>
    createOptionSetService()
      .create(optionSet)
      .then((response) => response.data);
  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["optionSets"],
      });
    },
  });
};

export const useOptionSet = () => ({ getOptionSets, useAddOptionSet });
