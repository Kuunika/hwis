export interface Set {
  concept_set_id: number;
  concept_set: number;
  sort_weight: number;
  uuid: string;
  names: Name[];
}
export interface Name {
  concept_id: number;
  name: string;
  uuid: string;
}

export interface Concept {
  concept_id: number;
  is_set: number;
  uuid: string;
  set_members: Set[];
  names: Name[];
}

export interface Address {
  address1?: string;
  address2?: string;
  address3?: string;
  stateProvince?: string;
  countyDistrict?: string;
  county_district?: string;
  cityVillage?: string;
  country?: string;
  postalCode?: string;
  preferred?: boolean
}

export interface Identifier {
  identifier: string;
  identifier_type: {
    name: string;
    uuid: string
  }
  preferred: boolean;
}

export interface Person {
  patient_id: number;
  identifiers: Identifier[];
  given_name: string;
  family_name: string;
  aetc_visit_number: string;
  gender: string;
  birthdate: Date;
  addresses: Address[];
  uuid: string;
  visit_uuid: string;
  arrival_time: string;
  names: Array<{
    given_name: string;
    family_name: string
  }>
}

interface EncounterType {
  name: string;
  description: string;
  uuid: string;
}

interface Obs {
  obs_id: number;
  person_id: number;
  concept_id: number;
  encounter_id: number;
  order_id: number | null;
  obs_datetime: string;
  obs_group_id: number | null;
  accession_number: any;
  value_datetime: string | null;
  value_numeric: number | null;
  value_text: string | null;
  value_complex: any;
  comments: any;
  uuid: string;
  previous_version: any;
  form_namespace_and_path: any;
  status: string;
  interpretation: any;
  value: any;
  value_coded_uuid: any;
}

export interface Encounter {
  encounter_id: number;
  encounter_type: EncounterType;
  patient_id: number;
  form_id: number | null;
  encounter_datetime: string;
  visit_id: number;
  uuid: string;
  obs: Obs[];
}

export interface Visit {
  uuid: string;
  patient: string;
  visitType: string;
  startDatetime: string;
}

export interface LabRequest {
  id?: any;
  uuid: string,
  test: string;
  sample: string;
  sampleType: string;
  specimenSite: string
  testType?: string
}



export interface Role {
  role: string;
  description: string;
  uuid: string
}

export interface UserRole {
  user_id: number;
  role: Role

}
export interface User {
  uuid: string;
  username: string;
  user_roles: UserRole[],
  person: Person
}

export interface IApiService {
  getAll<T>(query?: string): Promise<any>;

  getOne<T>(id: string | string, query?: string): Promise<any>;

  create<T>(data: Partial<T>): Promise<any>;

  edit<T>(id: string | number, data: Partial<T>): Promise<any>;
}

export type TriageResult = "" | "yellow" | "red" | "green";


export type DDESearch = {
  locals: Person[];
  remotes: Person[];
}