import { AETC_VISIT_TYPE, encounters } from "@/constants";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PatientVisitService } from "mahis-api-client";
export const addObservation = () => {
  const queryClient = useQueryClient();
  const addData = async (vitalsData: any) => {
    const visit = new PatientVisitService(new Date().toISOString());

    await visit.loadPatient("d938c488-4245-4e47-b751-b50f44068506");

    await visit.startVisit(AETC_VISIT_TYPE);

    await visit.createEncounter(encounters.VITALS, mappedData(vitalsData));

    // await visit.stopVisit("");
    return new Promise((resolve, reject) => {});
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
};

const mappedData = (vitals: any) => {
  return Object.keys(vitals).map((vital) => {
    return {
      concept: vital,
      value: vitals[vital],
      obsDatetime: "2023-11-20",
    };
  });
};
