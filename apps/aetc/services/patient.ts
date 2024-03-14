import { DDESearch, Person } from "@/interfaces";
import { create, edit, getAll, getOne } from "./httpService";

const endPoint = "/people";

export const createPatient = (patientData: any) =>
  create(patientData, endPoint);

export const initialRegistration = (patientData: any) =>
  create<Person>(patientData, "/patients");

export const getPatients = () => getAll<Array<any>>(endPoint);

export const getDailyVisits = (queryParam?: string) =>
  getAll<Person[]>(`/daily_visits?category=${queryParam}`);

export const updatePatient = (patientId: string, patientData: any) =>
  edit(patientId, patientData, endPoint);

export const potentialDuplicates = (patientData: any) =>
  create(patientData, "/search/people");


export const getPatient = (uuid: string) => getOne<Person>(uuid, '/patients');



export const findByNameAndGender = (firstName: string, lastName: string, gender: string) => getAll<DDESearch>(`/dde/patients/find_by_name_and_gender?given_name=${firstName}&family_name=${lastName}&gender=${gender}&visit_type_id=1`);

export const findByDemographics =
  (firstName: string,
    lastName: string,
    gender: string,
    birthdate: string,
    homeVillage: string,
    homeTA: string,
    homeDistrict: string) => getAll<DDESearch>(`/dde/patients/match_by_demographics?home_village=${homeDistrict}&home_traditional_authority=${homeTA}home_village=${homeVillage}&birthdate=${birthdate}&given_name=${firstName}&family_name=${lastName}&gender=${gender}&visit_type_id=1`);

