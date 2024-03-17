import { IApiService } from "@/interfaces";
import { AxiosInstance } from "axios";
import { setCookie, getCookie } from "cookies-next";
import { emrApiClient } from "./apiClients";

export async function getAll<T>(
  endPoint: string,
  query?: string,
  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.get<T>(`${endPoint}${query ? "?" + query : ""}`);
}
export async function getOne<T>(
  id: number | string,
  endPoint: string,
  query?: string,
  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.get<T>(`${endPoint}/${id}${query ? "?" + query : ""}`);
}
export async function get<T>(
  endPoint: string,

  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.get<T>(endPoint);
}

export async function create<T>(
  data: Partial<T>,
  endPoint: string,
  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.post<T>(endPoint, data);
}

export async function edit<T>(
  id: string | number,
  data: Partial<T>,
  endPoint: string,
  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.put(`${endPoint}/${id}`, data);
}
export async function login(
  credentials: any,
  apiClient: AxiosInstance = emrApiClient()
) {
  let response;

  try {
    response = await apiClient.post("/auth/login", credentials);
    setCookie("accessToken", response.data.jwt);



    localStorage.setItem("accessToken", response.data.jwt);

    const roles = response.data.user.user_roles.map((r: any) => r.role.role);

    localStorage.setItem("roles", roles);

    return {
      status: response.status,
      data: response.data,
      message: response.statusText,
    };
  } catch (error: any) {

    throw new Error(error.response.message);
  }
}
