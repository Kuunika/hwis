import { getAll } from "./httpService";
import { Drugs } from "@/interfaces";
const endpoint = "/drugs";

export const getDrugs = () =>
  getAll<Drugs[]>(endpoint, `paginate=false`);

export const getRegimenNames = ()=> getAll<Drugs[]>(`/moh_regimen_names`);