import { HttpService } from "./httpService";

export interface Option {
  id: string;
  label: string;
  value: string;
  hasWeight: string;
}

export interface OptionSet {
  id: string;
  label: string;
  description: string;
  options: Option[];
}

class OptionSetService extends HttpService {
  constructor() {
    super("/option-set");
  }
}

export const createOptionSetService = () => new OptionSetService();
