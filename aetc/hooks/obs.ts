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

export const getAllObservations = (
  patientId: any,
  conceptName: any,
  visitId?: any
) => {
  const getAll = async () => {
    const params = new URLSearchParams();
    params.append("person", patientId);
    params.append("conceptName", conceptName);
    params.append("paginate", "false");
    if (visitId) {
      params.append("visit_id", visitId);
    }

    const response = await getObservation(params.toString());
    return response.data;
  };

  return useQuery({
    queryKey: ["observations", patientId, conceptName, visitId],
    queryFn: getAll,
    enabled: !!patientId && !!conceptName,
    refetchOnReconnect: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
