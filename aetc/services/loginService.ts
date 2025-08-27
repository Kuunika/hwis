import { login } from "./httpService";

export const authenticate = async (credentials: any) =>
  await login(credentials);
