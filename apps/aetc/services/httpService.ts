import { IApiService } from "@/interfaces";
import { AxiosInstance } from "axios";

export class HttpService implements IApiService {
  protected endPoint: string;
  protected apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance, endPoint: string) {
    this.endPoint = endPoint;
    this.apiClient = apiClient;
  }

  getAll<T>(query?: string) {
    return this.apiClient.get<T[]>(
      `${this.endPoint}${query ? "?" + query : ""}`
    );
  }
  getOne<T>(id: number | string, query?: string) {
    return this.apiClient.get<T>(
      `${this.endPoint}/${id}${query ? "?" + query : ""}`
    );
  }

  create<T>(data: Partial<T>) {
    return this.apiClient.post<T>(this.endPoint, data);
  }

  edit<T>(id: string | number, data: Partial<T>) {
    return this.apiClient.put(`${this.endPoint}/${id}`, data);
  }
}
