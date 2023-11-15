export interface IApiService {
  getAll<T>(query?: string): Promise<any>;

  getOne<T>(id: string | string, query?: string): Promise<any>;

  create<T>(data: Partial<T>): Promise<any>;

  edit<T>(id: string | number, data: Partial<T>): Promise<any>;
}
