import { getDateTime } from "@/helpers/dateTime";
import { createRelationship, createPerson } from "@/services/people";
import { useQueryClient, useMutation } from "@tanstack/react-query";

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
