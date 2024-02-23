import { Visit } from "@/interfaces";
import { create, edit } from "./httpService";

const endpoint = "visits";
export const createVisit = (visitData: any) =>
  create<Visit>(visitData, endpoint);

export const closeVisit = (visitUUID: string, closeData: any) =>
  edit(visitUUID, closeData, endpoint);
