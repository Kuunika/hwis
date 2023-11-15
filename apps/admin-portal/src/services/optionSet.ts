import { formBuilderApiClient } from "./apiClients";
import { HttpService } from "./httpService";

export interface Option {
  id: string;
  label: string;
  value: string;
  hasWeight: string;
}

export interface OptionSet {
  id: string | number;
  label: string | number;
  description: string;
  options: Option[];
}

class OptionSetService extends HttpService {
  constructor() {
    super(formBuilderApiClient, "/option-sets");
  }
}

export const createOptionSetService = () => new OptionSetService();
