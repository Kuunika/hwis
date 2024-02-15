import { createPatient, getDailyVisits, getPatients } from "@/services/patient";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const addPatient = () => {
  const addData = (patientData: any) => {
    return createPatient(patientData).then((response) => {
      return response.data;
    });
  };

  return useMutation({
    mutationFn: addData,
  });
};

export const getInitialRegisteredPatients = () => {
  const getall = () =>
    getDailyVisits().then((response) =>
      response.data.map((p) => ({
        id: p?.patient_uuid,
        given_name: p?.patient_first_name,
        family_name: p?.patient_last_name,
        arrivalTime: p?.encounter_datetime,
        visitNumber: p?.visit_number,
        visit_uuid: p?.visit_uuid,
      }))
    );

  return useQuery({
    queryKey: ["visits"],
    queryFn: getall,
    enabled: true,
  });
};
