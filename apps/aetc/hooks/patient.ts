import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PatientService } from "mahis-api-client";
import { ToastContainer, toast } from "react-toastify";

export const addPatient = () => {
  const queryClient = useQueryClient();
  const addData = (patientData: any) => {
    const notify = () =>
      toast.success("Patient demographics Saved successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    notify();
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
        identifierType: "ba2f69d8-8d80-11d8-abbb-0024217bb78e",
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
