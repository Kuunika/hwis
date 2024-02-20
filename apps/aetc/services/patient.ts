import { create, edit, getAll } from "./httpService";

const endPoint = "/people";

export const createPatient = (patientData: any) =>
  create(patientData, endPoint);

export const initialRegistration = (patientData: any) =>
  create(patientData, "/patients");

export const getPatients = () => getAll<Array<any>>(endPoint);
export const getDailyVisits = (queryParam?: string) =>
  getAll<Array<any>>(`/daily_visits?category=${queryParam}`);
export const updatePatient = (patientId: string, patientData: any) =>
  edit(patientId, patientData, endPoint);
