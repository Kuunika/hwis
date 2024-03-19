import { getAll } from "./httpService";
import { TestType } from "@/interfaces";

export const getTestTypes = () => getAll<TestType[]>('/lab/test_types');
export const getSpecimenTypes = () => getAll<TestType[]>('/lab/specimen_types');

