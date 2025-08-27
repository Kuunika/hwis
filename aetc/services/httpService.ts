import { IApiService } from "@/interfaces";
import  { AxiosInstance } from "axios";
import { setCookie, getCookie } from "cookies-next";
import { emrApiClient } from "./apiClients";
import { getTime } from "@/helpers/dateTime";

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
  return apiClient.put(`${endPoint}/${id}`, data );
}

//remove function to delete diagnosis
export async function remove<T>(
  endPoint: string,
  data: any,
  apiClient: AxiosInstance = emrApiClient()
) {
  return apiClient.delete(endPoint, { data });
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
    localStorage.setItem("loginTime", new Date().getTime().toString());
    const data = response.data.user;
    const roles = data.user_roles.map((r: any) => r.role.role);
    const names = data.person?.names?.[0];
    const givenName = names?.given_name || null;
    const familyName = names?.family_name || null;

    localStorage.setItem("roles", roles);
    localStorage.setItem("userName", givenName + " " + familyName);

    return {
      status: response.status,
      data: response.data,
      message: response.statusText,
    };
  } catch (error: any) {
    throw new Error(error.response.message);
  }
}

export async function   update<T>(
    id: string | number, 
    endPoint: string,
    data: Partial<T>,
    apiClient:AxiosInstance= emrApiClient()
)
{
  return apiClient.put(`${endPoint}/${id}`,data);
}
  

