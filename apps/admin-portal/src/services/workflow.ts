import { Form } from ".";
import { formBuilderApiClient } from "./apiClients";
import { HttpService } from "./httpService";

export interface WorkFlow {
  id: string;
  name: string;
  forms: Form[];
}

class WorkFlowService extends HttpService {
  constructor() {
    super(formBuilderApiClient, "/workflows");
  }
}

export const createWorkFlowService = () => new WorkFlowService();
