import { Concept, createConceptService } from "@/services/concept";
import { useQuery } from "@tanstack/react-query";

const getConcepts = (queryString?: string, enabled = true) => {
  const fetchConcepts = () =>
    createConceptService()
      .getAll<Concept>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["concepts"],
    queryFn: fetchConcepts,
    enabled,
  });
};

export const useConcepts = () => ({ getConcepts });
