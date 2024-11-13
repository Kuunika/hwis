import { create, getAll, remove } from "./httpService";
import { Encounter } from "@/interfaces";
const endpoint = "/encounters";
const obs_endpoint = "/observations"
export const createEncounter = (encounter: any) => create<Encounter>(encounter, endpoint);
export const getPatientEncounters = (patientId: string) =>
  getAll<Encounter[]>(endpoint, `patient=${patientId}`);

// export const deleteEncounter = (encounterId: string) => remove(`${endpoint}/${encounterId}`, {
//   void_reason: "Deleted by user",
// });

export const deleteObservation = (obs_id: string) => remove(`${obs_endpoint}/${obs_id}`, {
  void_reason: "Deleted by user",
});
