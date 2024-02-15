import { create } from "./httpService";
import { emrApiClient } from "./apiClients";

const endpoint = "/encounters";
export const createEncounter = (encounter: any) => create(encounter, endpoint);
