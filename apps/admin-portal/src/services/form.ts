import { Frag } from "@/contexts";
import { HttpService } from "./httpService";
import { formBuilderApiClient } from "./apiClients";

export interface Form {
  id: string;
  name: string;
  fragments: Frag[];
}

class FormService extends HttpService {
  constructor() {
    super(formBuilderApiClient, "/form");
  }
}

export const createFormService = () => new FormService();
