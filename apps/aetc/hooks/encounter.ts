import { createEncounter, getPatientEncounters } from "@/services/encounter";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const addEncounter = () => {
  const queryClient = useQueryClient();
  const addData = (encounter: any) => {
    const filteredEncounter = {
      ...encounter,
      obs: encounter.obs.filter((ob: any) => Boolean(ob.value)),
    };
    return createEncounter(filteredEncounter).then((response) => response.data);
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["encounters"],
      });
    },
  });
};

export const getPatientsEncounters = (patientId: string) => {
  const getall = (patientId: string) =>
    getPatientEncounters(patientId).then((response) => response.data);

  return useQuery({
    queryKey: ["encounters", patientId],
    queryFn: () => getall(patientId),
    enabled: true,
  });
};
