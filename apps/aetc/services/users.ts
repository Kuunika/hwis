import { User } from "@/interfaces";
import { create, edit, getAll, getOne } from "./httpService";

const endPoint = "/users";

export const createUser = (patientData: any) =>
    create(patientData, endPoint);

export const getUsers = () => getAll<User>(endPoint);

