import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PatientService, IdentificationTypeName } from "mahis-api-client";
export const addPatient = () => {
  const queryClient = useQueryClient();
  const addData = (patientData: any) => {
    return PatientService.create(mapPatient(patientData));
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
};

const mapPatient = (patient: any) => {
  console.log({ patient });
  return {
    identifiers: [
      {
        identifier: patient.identificationNumber,
        identifierType:
          "ba2f69d8-8d80-11d8-abbb-0024217bb78e" as IdentificationTypeName,
        preferred: true,
      },
    ],
    person: {
      names: [
        {
          givenName: patient.firstName,
          familyName: patient.lastName,
          familyName2: patient.lastName,

          prefix: "Mr",
        },
      ],
      gender: patient.gender,
      birthdate: "1995-01-08", //patient.dob,
      birthdateEstimated: true,
      addresses: [
        {
          address1: patient.currentDistrict,
          cityVillage: patient.currentVillage,
          address2: patient.homeDistrict,
          stateProvince: patient.currentTraditionalAuthority,
        },
      ],
    },
  };
};
