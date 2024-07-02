import { get } from "./httpService";

const endpoint = "generate_visit_number";
export const getVisitNumber = () =>
  get<{ next_visit_number: number }>(endpoint);
