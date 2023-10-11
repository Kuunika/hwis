import { AxiosInstance } from "axios";
import apiClient from "./apiClient";

export class HttpService {
  protected endPoint: string;
  protected apiClient: AxiosInstance;

  constructor(endPoint: string) {
    this.endPoint = endPoint;
    this.apiClient = apiClient;
  }

  getAll<T>(query?: string) {
    return this.apiClient.get<{ data: Array<{ id: number; attributes: T }> }>(
      `${this.endPoint}${"?" + query}`
    );
  }
  getOne<T>(id: number, query?: string) {
    return this.apiClient.get<{ data: T }>(
      `${this.endPoint}/${id}${"?" + query}`
    );
  }

  create<T>(data: Partial<T>) {
    return this.apiClient.post<T>(this.endPoint, { data });
  }

  edit<T>(id: string | number, data: Partial<T>) {
    return this.apiClient.put(`${this.endPoint}/${id}`, {
      data,
    });
  }
}
