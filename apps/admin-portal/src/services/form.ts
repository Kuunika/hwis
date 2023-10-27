import { Frag } from "@/contexts";
import { HttpService } from "./httpService";

export interface Form {
  name: string;
  fragments: Frag[];
}

class FormService extends HttpService {
  constructor() {
    super("/forms");
  }
}

export const createFormService = () => new FormService();
