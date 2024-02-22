import { concepts } from "@/constants";
import {
  createPatient,
  getDailyVisits,
  getPatients,
  initialRegistration,
  potentialDuplicates,
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
export const initialPatientRegistration = () => {
  const addData = (patientData: any) => {
    return initialRegistration(patientData).then((response) => {
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
    };
    return updatePatient(patientData.id, mappedPatient).then((response) => {
      return response.data;
    });
    // return createPatient(mappedPatient).then((response) => {
    //   return response.data;
    // });
  };

  return useMutation({
    mutationFn: addData,
  });
};

export const getPatientsWaitingForPrescreening = () => {
  const getall = () =>
    getDailyVisits("screening").then((response) => response.data);

  return useQuery({
    queryKey: ["screening"],
    queryFn: getall,
    enabled: true,
  });
};

export const getPatientsWaitingForRegistrations = () => {
  const getall = () =>
    getDailyVisits("registration").then((response) => response.data);

  return useQuery({
    queryKey: ["registration"],
    queryFn: getall,
    enabled: true,
  });
};

export const getPatientsWaitingForTriage = () => {
  const getall = () =>
    getDailyVisits("triage").then((response) => response.data);

  return useQuery({
    queryKey: ["triage"],
    queryFn: getall,
    enabled: true,
  });
};
export const getPatientsWaitingForAssessment = () => {
  const getall = () =>
    getDailyVisits("assessment").then((response) => response.data);

  return useQuery({
    queryKey: ["assessments"],
    queryFn: getall,
    enabled: true,
  });
};

export const searchPotentialDuplicates = () => {
  const addData = (patientData: any) => {
    return potentialDuplicates(patientData).then((response) => {
      return response.data;
    });
  };
  return useMutation({
    mutationFn: addData,
  });
};
