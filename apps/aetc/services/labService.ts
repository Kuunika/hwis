
import { getAll, create } from "./httpService";
import { LabReason, LabResult, SpecimenType, TestType } from "@/interfaces";

export const getTestTypes = () => getAll<TestType[]>('/lab/test_types');
export const getSpecimenTypes = () => getAll<SpecimenType[]>('/lab/specimen_types');
export const getLabReason = () => getAll<LabReason[]>('/lab/reasons_for_test');
export const createLabOrder = (order: any) => create(order, '/lab/orders')
export const getPatientLabTests = (id: string) => getAll<LabResult[]>(`/lab/tests?patient=${id}`)