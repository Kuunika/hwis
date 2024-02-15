import { create, edit, getAll } from "./httpService";

const endPoint = "/patients";

export const createPatient = (patientData: any) =>
  create(patientData, endPoint);

export const getPatients = () => getAll<Array<any>>(endPoint);
export const getDailyVisits = () => getAll<Array<any>>("/daily_visits");
export const updatePatient = (patientId: string, patientData: any) =>
  edit(patientId, patientData, endPoint);
