import { create, getAll, remove } from "./httpService";
import { Encounter } from "@/interfaces";
const endpoint = "/encounters";
export const createEncounter = (encounter: any) => create<Encounter>(encounter, endpoint);
export const getPatientEncounters = (patientId: string) =>
  getAll<Encounter[]>(endpoint, `patient=${patientId}`);

export const deleteEncounter = (encounterId: string) => remove(`${endpoint}/${encounterId}`, {
  void_reason: "Deleted by user",
});
