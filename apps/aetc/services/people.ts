import { create, getAll } from "./httpService";

const endPoint = "/people";

export const createPerson = (patientData: any) => create(patientData, endPoint);

export const createRelationship = (relationship: any) =>
  create(relationship, "/relationships");
