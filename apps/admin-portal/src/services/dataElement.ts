import { HttpService } from "./httpService";

export interface DataElement {
  id: string;
  label: string;
  description: string;
}

class DataElementService extends HttpService {
  constructor() {
    super("/data-elements");
  }
}

export const createDataElementService = () => new DataElementService();
