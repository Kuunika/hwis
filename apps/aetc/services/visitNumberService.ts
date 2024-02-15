import { getAll } from "./httpService";

const endpoint = "generate_visit_number";
export const getVisitNumber = () => getAll(endpoint);
