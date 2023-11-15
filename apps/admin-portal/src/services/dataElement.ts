import { formBuilderApiClient } from "./apiClients";
import { HttpService } from "./httpService";

export interface DataElement {
  id: string;
  label: string;
  description: string;
}

class DataElementService extends HttpService {
  constructor() {
    super(formBuilderApiClient, "/data-elements");
  }
}

export const createDataElementService = () => new DataElementService();
