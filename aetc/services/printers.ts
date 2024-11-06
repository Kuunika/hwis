import { create, getAll } from "./httpService";
import { Printer } from "@/interfaces";
const endpoint = "/printers";
export const createPrinter = (encounter: any) => create<Printer>(encounter, endpoint);
export const getAllPrinters = () =>
  getAll<Printer[]>(endpoint, `paginate=false`);
