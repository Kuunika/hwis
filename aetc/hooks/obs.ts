import { createObservation } from "@/services/observationService";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const addObsChildren = () => {
  const queryClient = useQueryClient();
  
  const addData = async (obs: any) => {
    try {
      const response = await createObservation(obs);
      return response.data;
    } catch (error) {
      console.error("Failed to add observations:", error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["observations"],
      });
    },
  });
};