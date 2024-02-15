import { create, getAll } from "./httpService";

const endPoint = "/patients";

export const createPatient = (patientData: any) =>
  create(patientData, endPoint);

export const getPatients = () => getAll<Array<any>>(endPoint);
export const getDailyVisits = () => getAll<Array<any>>("/daily_visit");
