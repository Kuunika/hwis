import { concepts } from "@/constants";
import {
  createPatient,
  getDailyVisits,
  getPatients,
  updatePatient,
} from "@/services/patient";
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

export const registerPatient = () => {
  const addData = (patientData: any) => {
    const mappedPatient = {
      identifiers: [
        {
          identifier: patientData.identificationNumber,
          identifierType: concepts.NATIONAL_ID_IDENTIFIER_TYPE,
          preferred: true,
        },
      ],
      person: {
        names: [
          {
            givenName: patientData.firstName,
            familyName: patientData.lastName,
          },
        ],
        gender: patientData.gender,
        birthdate: patientData.birthDate,
        addresses: [
          {
            address1: patientData.homeVillage,
            countryDistrict: patientData.homeDistrict,
            cityVillage: patientData.homeTraditionalAuthority,
            country: patientData.nationality,
            preferred: true,
          },
          {
            address1: patientData.currentVillage,
            address2: patientData.closeLandMark,
            countryDistrict: patientData.currentDistrict,
            cityVillage: patientData.currentTraditionalAuthority,
            preferred: false,
          },
        ],
      },
    };
    // return updatePatient(patientData.id, mappedPatient).then((response) => {
    //   return response.data;
    // });
    return createPatient(mappedPatient).then((response) => {
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
