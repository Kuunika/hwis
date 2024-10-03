import { concepts } from "@/constants";
import { PaginationModel } from "@/interfaces";
import {
  createPatient,
  findByDemographics,
  findByNPID,
  findByNameAndGender,
  getDailyVisits,
  getDailyVisitsPaginated,
  getPatient,
  getPatientVisits,
  getPatients,
  getRelations,
  getRelationshipTypes,
  initialRegistration,
  mergePatients,
  potentialDuplicates,
  updatePatient,
} from "@/services/patient";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const patchPatient = () => {
  const addData = (patientData: any) => {
    return updatePatient(patientData.id, { ...patientData.data }).then(
      (response) => {
        return response.data;
      }
    );
  };

  return useMutation({
    mutationFn: addData,
  });
};

export const registerPatient = () => {
  const addData = (patientData: any) => {
    const getAddress = (address: any) => (address !== "" ? address : "N/A");

    const identifiers =
      patientData.identificationNumber == ""
        ? []
        : [
            {
              identifier: patientData.identificationNumber,
              identifierType: concepts.NATIONAL_ID_IDENTIFIER_TYPE,
              preferred: true,
            },
          ];

    const mappedPatient = {
      identifiers,
      names: [
        {
          givenName: patientData.firstName,
          familyName: patientData.lastName,
        },
      ],
      gender: patientData.gender,
      birthdateEstimated: patientData.birthdateEstimated,
      birthdate: patientData.birthDate,
      addresses: [
        {
          address1: getAddress(patientData.homeDistrict),
          address2: getAddress(patientData.homeVillage),
          address3: getAddress(patientData.currentDistrict),
          stateProvince: getAddress(patientData.currentTraditionalAuthority),
          countyDistrict: getAddress(patientData.homeTraditionalAuthority),
          cityVillage: getAddress(patientData.homeTraditionalAuthority),
          country: getAddress(patientData.nationality),
          preferred: true,
        },
        {
          address1: getAddress(patientData.currentVillage),
          address2: getAddress(patientData.closeLandMark),
          countryDistrict: getAddress(patientData.currentDistrict),
          cityVillage: getAddress(patientData.currentTraditionalAuthority),
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
    // refetchInterval: 1000 * 60,
  });
};

export const getPatientsWaitingForRegistrations = () => {
  const getall = () =>
    getDailyVisits("registration").then((response) => response.data);

  return useQuery({
    queryKey: ["registration"],
    queryFn: getall,
    enabled: true,
    // refetchInterval: 1000 * 30,
  });
};

export const getPatientsWaitingForTriage = () => {
  const getall = () =>
    getDailyVisits("triage").then((response) => response.data);

  return useQuery({
    queryKey: ["triage"],
    queryFn: getall,
    enabled: true,
    // refetchInterval: 1000 * 30,
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

export const getPatientsWaitingForAssessmentPaginated = (
  paginationDetails: PaginationModel, search?:string
) => {
  const page = paginationDetails.page==0 ? 1 :paginationDetails.page;
  const getall = () =>
    getDailyVisitsPaginated(
      `category=assessment&page=${page}&page_size=${paginationDetails.pageSize}&search=${search}`
    ).then((response) => response.data);

  return useQuery({
    queryKey: ["assessment",paginationDetails.page, paginationDetails.pageSize, search],
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

export const getOnePatient = (patientId: string) => {
  const getOne = () => getPatient(patientId).then((response) => response.data);

  return useQuery({
    queryKey: ["patients", patientId],
    queryFn: getOne,
    enabled: true,
  });
};
export const searchDDEPatient = (
  firstName: string,
  lastName: string,
  gender: string
) => {
  const findAll = () =>
    findByNameAndGender(firstName, lastName, gender).then(
      (response) => response.data
    );

  return useQuery({
    queryKey: ["find_by_gender", firstName, lastName, gender],
    queryFn: findAll,
    enabled: false,
    retry: false,
  });
};

export const searchDDEPatientByNpid = (npid: string) => {
  const findAll = () => findByNPID(npid).then((response) => response.data);
  return useQuery({
    queryKey: ["find_by_npid", npid],
    queryFn: findAll,
    enabled: false,
  });
};

export const searchByDemographics = (
  firstName: string,
  lastName: string,
  gender: string,
  birthdate: string,
  homeVillage: string,
  homeTA: string,
  homeDistrict: string
) => {
  const findAll = () =>
    findByDemographics(
      firstName,
      lastName,
      gender,
      birthdate,
      homeVillage,
      homeTA,
      homeDistrict
    ).then((response) => response.data);

  return useQuery({
    queryKey: ["find_by_demographics", firstName, lastName, gender],
    queryFn: findAll,
    enabled: false,
  });
};

export const merge = () => {
  const addData = (patientData: any) => {
    return mergePatients(patientData).then((response) => {
      return response.data;
    });
  };

  return useMutation({
    mutationFn: addData,
  });
};

export const getPatientRelationships = (patientId: string) => {
  const getAll = () =>
    getRelations(patientId).then((response) => response.data);

  return useQuery({
    queryKey: ["patient_relations", patientId],
    queryFn: getAll,
    enabled: true,
  });
};

export const getPatientRelationshipTypes = () => {
  const getAll = () =>
    getRelationshipTypes().then((response) => response?.data);

  return useQuery({
    queryKey: ["patient_relationship_types"],
    queryFn: getAll,
    enabled: true,
  });
};

export const getPatientVisitTypes = (id: string) => {
  const getAll = () => getPatientVisits(id).then((response) => response?.data);

  return useQuery({
    queryKey: ["patient", id, "visits"],
    queryFn: getAll,
    enabled: true,
  });
};
