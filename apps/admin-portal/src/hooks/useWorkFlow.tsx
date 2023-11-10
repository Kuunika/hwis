import { createWorkFlowService, WorkFlow } from "@/services";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const getWorkflows = (queryString?: string, enabled = true) => {
  const fetchWorkFlows = () =>
    createWorkFlowService()
      .getAll<WorkFlow>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["workflows"],
    queryFn: fetchWorkFlows,
    enabled,
  });
};

export const useAddWorkflow = () => {
  const queryClient = useQueryClient();
  const addData = (event: any) =>
    createWorkFlowService()
      .create(event)
      .then((response) => response.data);
  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    },
  });
};

export const useWorkflow = () => ({ getWorkflows, useAddWorkflow });
