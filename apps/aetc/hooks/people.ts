import { getDateTime } from "@/helpers/dateTime";
import { createRelationship, createPerson, searchPerson, searchRegistrationPerson } from "@/services/people";
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
    const gender = patient.gender
    return searchPerson(`given_name=${givenName}&family_name=${familyName}&gender=${gender}&middle_name&paginate=false`).then((response) => response.data.map((person: any) => {
      return {
        person_id: person.person_id,
        uuid: person.uuid,
        given_name: person.names[0].given_name,
        family_name: person.names[0].family_name,
        gender: person.gender,
        birthdate: person.birthdate
      }
    }));
  }

  return useQuery({
    queryKey: ["search"],
    queryFn: () => getall(patient),
    enabled: false,
  });
};


export const searchRegPatients = (patient: any) => {


  const getall = (patient: any) => {
    const givenName = patient.firstName;
    const familyName = patient.lastName;
    const gender = patient.gender
    return searchRegistrationPerson(`given_name=${givenName}&family_name=${familyName}&gender=${gender}&middle_name&paginate=false`).then((response) => response.data.map(d => d.patient));
  }
  return useQuery({
    queryKey: ["search", `given_name=${patient.givenName}&family_name=${patient.familyName}&gender=${patient.gender}`],
    queryFn: () => getall(patient),
    enabled: false,
  });
}