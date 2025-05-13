import {
  createObservation,
  getObservation,
} from "@/services/observationService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getAll } from "@/services/httpService";

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

export const getAllObservations = (patientId: any, conceptName: any) => {
  const getAll = async () => {
    const response = await getObservation(
      `person=${patientId}&conceptName=${conceptName}`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["observations", patientId, conceptName],
    queryFn: getAll,
    enabled: !!patientId && !!conceptName, // only run if both are present
    refetchOnReconnect: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
