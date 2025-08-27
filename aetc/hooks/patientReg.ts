import { concepts } from "@/constants";
import { PaginationModel, Person } from "@/interfaces";
import {
  addDeathReport,
  checkPatientIfOnAssessment,
  createPatient,
  findByDemographics,
  findByNPID,
  findByNameAndGender,
  searchByNameAndGender,
  getDailyVisits,
  getDailyVisitsPaginated,
  getDeathReports,
  getPatient,
  getPatientVisits,
  getPatients,
  getRelations,
  getRelationshipTypes,
  initialRegistration,
  mergePatients,
  potentialDuplicates,
  updateDeathReport,
  updatePatient,
  voidPatient,
} from "@/services/patient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getConcept } from "./encounter";

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
  const addData = async (patientData: any) => {
    const getAddress = (address: any) => (address !== "" ? address : "N/A");

    const nationalIdIdentifierType = "dc047ea8-e9ce-4fd0-af93-a2ade6b14b42";

    const identifiers =
      patientData.identificationNumber == ""
        ? []
        : [
          {
            identifier: patientData.identificationNumber,
            identifierType: nationalIdIdentifierType,
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
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const getPatientsWaitingForRegistrations = () => {
  const getall = () =>
    getDailyVisits("registration").then((response: any) => {
      const { data } = response as {data: any};

      return Array.isArray(data) ? data : data.data as Person[];
    });

  return useQuery({
    queryKey: ["registration"],
    queryFn: getall,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const getPatientsWaitingForTriage = () => {
  const getall = () =>
    getDailyVisits("triage").then((response) => response.data);

  return useQuery({
    queryKey: ["triage"],
    queryFn: getall,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};
export const getPatientsWaitingForAssessment = () => {
  const getall = () =>
    getDailyVisits("assessment").then((response) => response.data);

  return useQuery({
    queryKey: ["assessments"],
    queryFn: getall,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    // enabled: true,
  });
};

export const getPatientCategoryListPaginated = (
  paginationDetails: PaginationModel,
  category: string,
  search?: string,
) => {
  const page = paginationDetails.page + 1;
 

  const getall = () =>
    getDailyVisitsPaginated(
      `category=${category}&page=${page}&page_size=${paginationDetails.pageSize}&search=${search}`
    ).then((response) => response.data);

  return useQuery({
    queryKey: [
      category,
      paginationDetails.page,
      paginationDetails.pageSize,
      search
    ],
    queryFn: getall,
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const getPatientsWaitingForDispositionPaginated = (
  paginationDetails: PaginationModel,
  search?: string
) => {
  const page = paginationDetails.page == 0 ? 1 : paginationDetails.page;

  const getall = () =>
    getDailyVisitsPaginated(
      `category=disposition&page=${page}&page_size=${paginationDetails.pageSize}&search=${search}`
    ).then((response) => response.data);

  return useQuery({
    queryKey: [
      "disposition",
      paginationDetails.page,
      paginationDetails.pageSize,
      search,
    ],
    queryFn: getall,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
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
    enabled: !!patientId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
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

export const searchLocalPatient = (
  firstName: string,
  lastName: string,
  gender: string
) => {
  const findAll = () =>
    searchByNameAndGender(firstName, lastName, gender).then(
      (response) => response.data
    );

  return useQuery({
    queryKey: ["find_by_name", firstName, lastName, gender],
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
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const checkIfPatientIsOnWaitingForAssessmentList = (id: string) => {
  const getAll = () =>
    checkPatientIfOnAssessment(id).then((response) => response?.data);
  return useQuery({
    queryKey: ["visits", id, "eligible"],
    queryFn: getAll,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const addBroughtDead = () => {
  const addData = (patientData: any) => {
    return addDeathReport(patientData).then((response) => {
      return response.data;
    });
  };

  return useMutation({
    mutationFn: addData,
  });
};

export const getAllDeathReports = () => {
  const getAll = () => getDeathReports().then((response) => response?.data);
  return useQuery({
    queryKey: ["death-reports"],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
};

export const useUpdateDeathReport = () => {
  const updateData = (params: { id: string | number; data: any }) => {
    return updateDeathReport(params.id, params.data).then((response) => {
      return response.data;
    });
  };

  return useMutation({
    mutationFn: updateData,
  });
};

export const deletePatient = () => {
  const addData = (patientData: any) => {
    return voidPatient(patientData.id, patientData.void_reason).then((response) => {
      return response.data;
    });
  };

  return useMutation({
    mutationFn: addData,
  });
};