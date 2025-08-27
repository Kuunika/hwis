import { getConcept } from "./encounter";
import { useQuery } from "@tanstack/react-query";

export const getConceptSet = (conceptSetName: string) => {
  const getAll = async () => {
    const concept = await getConcept(conceptSetName);

    if (!concept.data?.length) return []; 

    return concept.data[0].set_members.map(({ names }: { names: { name: string; uuid: string }[] }) => ({
      name: names[0]?.name || "Unknown",
      uuid: names[0]?.uuid || "N/A"
    }));
  };

  return useQuery({
    queryKey: [conceptSetName], 
    queryFn: getAll,
    enabled: !!conceptSetName, 
  });
};