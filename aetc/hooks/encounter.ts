import { Concept, Obs } from "@/interfaces";
import {
  createEncounter,
  getPatientEncounters,
  deleteObservation,
} from "@/services/encounter";
import { getAll } from "@/services/httpService";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const addEncounter = () => {
  const queryClient = useQueryClient();

  const addData = (encounter: any) => {
    const filteredEncounter = {
      ...encounter,
      obs: encounter.obs.filter((ob: any) => Boolean(ob.value)),
    };

    return createEncounter(filteredEncounter).then((response) => response.data);
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["encounters"],
      });
    },
  });
};

export const getPatientsEncounters = (patientId: string) => {
  const getall = (patientId: string) =>
    getPatientEncounters(patientId).then((response) => response.data);

  return useQuery({
    queryKey: ["encounters", patientId],
    queryFn: () => getall(patientId),
    enabled: true,
  });
};

export const removeObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
    },
  });
};

export const fetchConceptAndCreateEncounter = () => {
  // const queryClient = useQueryClient();

  const addData = async (encounter: any) => {
    const filteredEncounter = {
      ...encounter,
      obs: encounter.obs.filter((ob: any) => Boolean(ob.value)),
    };

  
    filteredEncounter.obs = await getConceptIds(filteredEncounter.obs);

 

    return createEncounter(filteredEncounter).then((response) => response.data);
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["encounters"],
      // });
    },
  });
};

const getConceptIds: any = async (obs: Obs[]) => {
  // const queryClient = useQueryClient();
  const obsWithUUIDs = [];
  try {
    for (let i = 0; i < obs.length; i++) {
      const conceptName = obs[i].concept;
      const concept = await getConcept(conceptName);
      // register cache
      // queryClient.setQueryData(["concepts", conceptName], concept);

      const groupMembers = Array.isArray(obs[i].groupMembers)
        ? await getConceptIds(obs[i].groupMembers)
        : [];

      if (concept.data.length > 0) {
        obsWithUUIDs.push({
          ...obs[i],
          concept: concept.data[0].uuid,
          groupMembers,
        });
      }
    }
  } catch (error) {
    console.log({ error });
  }

  return obsWithUUIDs;
};


export const getConcept:any = async (conceptName:string)=>{
  return await getAll<Concept[]>(
  `/concepts?name=${conceptName}&paginate=false&exact_match=true`
);
}


export const fetchConceptsSelectOptions =  async (options: Array<{id:string, label:string}>) => {
 const mappedSelectOptions = [];
for(let i=0; i<options.length; i++){

  // const key: 'id' | 'value' = options[i].id ? 'id' : 'value';

  const concept = await getConcept(options[i].id);

  if(concept.data.length){
    mappedSelectOptions.push({id: concept.data[0].uuid, label: options[i].label})
  }

  return mappedSelectOptions;

}
}