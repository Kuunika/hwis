import { emrApiClient, formBuilderApiClient } from "./apiClients";
import { HttpService } from "./httpService";

export interface Set {
  concept_set_id: number;
  concept_set: number;
  sort_weight: number;
  uuid: string;
  names: Name[];
}
export interface Name {
  concept_id: number;
  name: string;
}

export interface Concept {
  concept_id: number;
  is_set: number;
  uuid: string;
  set_members: Set[];
  names: Name[];
}

class ConceptService extends HttpService {
  constructor() {
    super(emrApiClient, "/concepts");
  }
}

export const createConceptService = () => new ConceptService();
