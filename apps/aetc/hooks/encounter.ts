import { createEncounter } from "@/services/encounter";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const addEncounter = () => {
  const queryClient = useQueryClient();
  const addData = (encounter: any) =>
    createEncounter(encounter).then((response) => response.data);

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["encounters"],
      });
    },
  });
};
