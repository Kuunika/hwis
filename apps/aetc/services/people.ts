
import { Person } from "@/interfaces";
import { create, getAll } from "./httpService";

const endPoint = "/people";

export const createPerson = (patientData: any) =>
  create<Person>(patientData, endPoint);

export const createRelationship = (relationship: any) =>
  create(relationship, "/relationships");
