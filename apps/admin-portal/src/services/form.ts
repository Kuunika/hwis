import { Frag } from "@/contexts";
import { HttpService } from "./httpService";

export interface Form {
  id: string;
  name: string;
  fragments: Frag[];
}

class FormService extends HttpService {
  constructor() {
    super("/form");
  }
}

export const createFormService = () => new FormService();
