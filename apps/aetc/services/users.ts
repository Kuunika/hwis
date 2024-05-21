import { User } from "@/interfaces";
import { create, getAll, getOne } from "./httpService";

const endPoint = "/users";

export const createUser = (patientData: any) => create(patientData, endPoint);

export const getUsers = () => getAll<User[]>(`${endPoint}?paginate=false`);
export const searchUser = (username: string) => getAll<User[]>(endPoint + "?paginate=false&username=" + username);

export const getUserById = (userId: string) => getOne<User>(userId, endPoint);

//export const updateUser = (userId: string, userData: any) => edit(userData, `${endPoint}/${userId}`);
