
import { concepts } from "@/constants";
import { getAll, create } from "./httpService";
import { Concept, LabReason, LabResult, PatientLabOrder, SpecimenType, TestType } from "@/interfaces";

export const getTestTypes = (name: string) => getSetMembers(name);
export const getSpecimenTypes = () => getSetMembers(concepts.INVESTIGATIONS)
export const getLabReason = () => getAll<LabReason[]>('/lab/reasons_for_test');
export const createLabOrder = (order: any) => create<PatientLabOrder[]>(order, '/lab/orders')
export const getPatientLabTests = (id: string) => getAll<PatientLabOrder[]>(`/lab/orders?patient=${id}`)
export const getSetMembers = (id: string) => getAll<Concept[]>(`/concepts/${id}/set_members?paginate=false`)
