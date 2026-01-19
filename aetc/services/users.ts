import { User } from "@/interfaces";
import { create, getAll, getOne, edit, update } from "./httpService";

const endPoint = "/users";

// Type for paginated response
export type PaginatedUsers = {
  count: number;
  results: User[];
};

export const createUser = (patientData: any) => create(patientData, endPoint);

export const getUsers = () => getAll<PaginatedUsers>(`${endPoint}?paginate=false`);
export const searchUser = (username: string) => getAll<PaginatedUsers>(endPoint + "?paginate=false&username=" + username);

export const getUserById = (userId: string) => getOne<User>(userId, endPoint);

export const updateUser = (userId: string, userData: any) =>  edit(userId, userData, endPoint);

export const updatePassword = (userId: string, userData: any) =>  update(userId, endPoint, userData);//added
