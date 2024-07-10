import { DDESearch, Patient } from "@/interfaces";

export const demographicSearchLocalAdaptor = (
  data: Patient[] | undefined
): DDESearch => {
  if (data) return { remotes: [], locals: data };


  return {remotes:[], locals:[]}
};

export const demographicSearchDDEAdaptor = (
  data: DDESearch | undefined
): DDESearch => {
  if (data) return data


  return {remotes:[], locals:[]}
};
