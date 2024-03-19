
import { getAll, create } from "./httpService";
import { LabReason, SpecimenType, TestType } from "@/interfaces";

export const getTestTypes = () => getAll<TestType[]>('/lab/test_types');
export const getSpecimenTypes = () => getAll<SpecimenType[]>('/lab/specimen_types');
export const getLabReason = () => getAll<LabReason[]>('/lab/reasons_for_test');
export const createLabOrder = (order: any) => create(order, '/lab/orders')