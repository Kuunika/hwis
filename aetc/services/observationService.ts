import { create } from "./httpService";
import { Obs } from "@/interfaces";
const endpoint = "/observations";
export const createObservation = (obs: any) => create<Obs>(obs, endpoint);