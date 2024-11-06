import { create, edit, getAll, getOne } from "./httpService";
import { Printer } from "@/interfaces";
const endpoint = "/printers";
export const createPrinter = (encounter: any) => create<Printer>(encounter, endpoint);
export const getAllPrinters = () =>
  getAll<Printer[]>(endpoint, `paginate=false`);
export const getAPrinter = (id:string)=>getOne(id,endpoint);
export const updatePrinter = (id:string, data:any)=>edit(id,data,endpoint);
