import { create, edit } from "./httpService";

const endpoint = "visits";
export const createVisit = (visitData: any) => create(visitData, endpoint);

export const closeVisit = (visitUUID: string, closeData: any) =>
  edit(visitUUID, closeData, endpoint);
