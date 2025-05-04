import { getAll } from "./httpService";
const endPoint = "/icd11_diagnoses/search_by_title";

export const searchICD11Diagnosis = (query: string) => {
    return getAll<[]>(`${endPoint}?title=${encodeURIComponent(query)}`);
  };