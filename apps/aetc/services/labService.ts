import { create, getAll } from "./httpService";
import { Encounter } from "@/interfaces";
const endpoint = "/encounters";
export const createEncounter = (encounter: any) => create(encounter, endpoint);
export const getPatientEncounters = (patientId: string) =>
    getAll<Encounter[]>(endpoint, `patient=${patientId}`);
