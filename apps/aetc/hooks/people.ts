import { getDateTime } from "@/helpers/dateTime";
import { createRelationship, createPerson, searchPerson } from "@/services/people";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const addPerson = () => {
  const queryClient = useQueryClient();
  const addData = (person: any) => {
    const mappedPerson = {
      names: [
        {
          givenName: person.nextOfKinFirstName,
          familyName: person.nextOfKinLastName,
        },
      ],
      birthdate: getDateTime(),
    };
    return createPerson(mappedPerson).then((response) => response.data);
  };
  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        // queryKey: ["visits"],
      });
    },
  });
};
export const addRelationship = () => {
  const addData = (data: any) => {
    const mappedData = {
      person_a: data.patient,
      person_b: data.person,
      relationship: data.nextOfKinRelationship,
    };
    return createRelationship(mappedData).then((response) => response.data);
  };

  return useMutation({
    mutationFn: addData,
  });
};


export const searchPatients = (patient: any) => {
  const getall = (patient: any) => {
    const givenName = patient.firstName;
    const familyName = patient.lastName

    return searchPerson(`given_name=${givenName}&family_name=${familyName}&gender=&middle_name`).then((response) => response.data);
  }


  return useQuery({
    queryKey: ["search"],
    queryFn: () => getall(patient),
    enabled: false,
  });
};