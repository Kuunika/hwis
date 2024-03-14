
import { Person } from "@/interfaces";
import { create, getAll } from "./httpService";

const endPoint = "/people";

export const createPerson = (patientData: any) =>
  create<Person>(patientData, endPoint);

export const createRelationship = (relationship: any) =>
  create(relationship, "/relationships");

export const searchPerson = (queryParams: string) => {
  return getAll(endPoint + '/search', queryParams);
}

export const searchDDEPatient = (patientData: any) =>
  create<Person>(patientData, endPoint);

