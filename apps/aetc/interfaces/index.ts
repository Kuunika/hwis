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
}

export interface Concept {
  concept_id: number;
  is_set: number;
  uuid: string;
  set_members: Set[];
  names: Name[];
}
export interface IApiService {
  getAll<T>(query?: string): Promise<any>;

  getOne<T>(id: string | string, query?: string): Promise<any>;

  create<T>(data: Partial<T>): Promise<any>;

  edit<T>(id: string | number, data: Partial<T>): Promise<any>;
}

export type TriageResult = "" | "yellow" | "red" | "green";
