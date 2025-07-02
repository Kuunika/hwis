import { create, getAll } from "./httpService";
import { Obs } from "@/interfaces";
const endpoint = "/observations";
export const createObservation = (obs: any) => create<Obs>(obs, endpoint);
export const getObservation = (query: any) => getAll(endpoint, query);
