
import { PatientUpdateResponse, Person } from "@/interfaces";
import { create, getAll } from "./httpService";

const endPoint = "/people";



export const createPerson = (patientData: any) =>
  create<Person>(patientData, endPoint);

export const createRelationship = (relationship: any) =>
  create(relationship, "/relationships");

export const searchPerson = (queryParams: string) => {
  return getAll<Person[]>(endPoint + '/search', queryParams + "&paginate=false");
}

export const searchRegistrationPerson = (queryParams: string) => {
  return getAll<PatientUpdateResponse[]>(endPoint + '/search', queryParams + "&paginate=false");
}

export const searchDDEPatient = (patientData: any) =>
  create<Person>(patientData, endPoint);
