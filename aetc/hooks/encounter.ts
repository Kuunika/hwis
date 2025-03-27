import { Concept, Obs } from "@/interfaces";
import { queryClient } from "@/providers";
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
      console.log({data});
      queryClient.invalidateQueries({
        queryKey: ["encounters", data.person_uuid]
      });
    },
  });
};

const getConceptIds: any = async (obs: Obs[]) => {
  const obsWithUUIDs = [];

  try {
    for (const observation of obs) {
      const conceptName = observation.concept as unknown as string;
     
      let concept:any = await getConceptFromCacheOrFetch(conceptName);


      let value= observation.value;

      if(observation.coded || concept?.data[0].datatype=='Coded'){

        value =  (await getConceptFromCacheOrFetch(observation.value))?.data[0].uuid

      }
      
    
      const groupMembers = Array.isArray(observation.groupMembers)
        ? await getConceptIds(observation.groupMembers)
        : [];
  
      if (concept.data.length > 0) {
        obsWithUUIDs.push({
          ...observation,
          concept: concept?.data[0]?.uuid,
          value,
          groupMembers,
          conceptName
        });
      }


    }
  } catch (error) {
    console.log({ error });
  }

  return obsWithUUIDs;
};


export const getConceptFromCacheOrFetch = async (conceptName:string)=>{
  const cachedConcept = queryClient.getQueryData(["concepts", conceptName]);
  let concept;
  if (cachedConcept) {
    concept = cachedConcept 
   console.log("using cached data",cachedConcept);
  } else {
  
    concept = await getConcept(conceptName);
    queryClient.setQueryData(["concepts", conceptName], concept);
    queryClient.setQueryData([concept.data[0].uuid], conceptName);
  }
  return concept
}



export const getConcept:any = async (conceptName:string)=>{
  return await getAll<Concept[]>(
  `/concepts?name=${conceptName}&paginate=false&exact_match=true`
);
}


type ConceptOption = { id: string; label: string };
type RadioOption = { value: any; label: string };

const fetchConcepts = async (options: Array<{ key: string; label: string }>, useValueKey: boolean) => {
  const mappedOptions = [];

  for (const option of options) {
    const cachedConcept = queryClient.getQueryData(["concepts", option.key]);

    let conceptData = cachedConcept ? cachedConcept : await getConcept(option.key);

    if (!cachedConcept) {
      queryClient.setQueryData(["concepts", option.key], conceptData);
      queryClient.setQueryData([conceptData.data[0]?.uuid], option.key);

    }

    if (conceptData.data.length) {
      mappedOptions.push({ [useValueKey ? "value" : "id"]: conceptData.data[0]?.uuid, label: option.label });
    }
  }

  return mappedOptions;
};

export const fetchConceptsSelectOptions = (options: ConceptOption[]) => 
  fetchConcepts(options.map(({ id, label }) => ({ key: id, label })), false);

export const fetchConceptsRadioOptions = (options: RadioOption[]) => 
  fetchConcepts(options.map(({ value, label }) => ({ key: value, label })), true);

