import { FormDataElement, Frag } from "@/contexts";
import { HttpService } from "./httpService";
import { formBuilderApiClient } from "./apiClients";

export interface Form {
  id: string | number;
  formName: string;
  formInputs: FormDataElement[];
}

class FormService extends HttpService {
  constructor() {
    super(formBuilderApiClient, "/forms");
  }
}

export const createFormService = () => new FormService();
