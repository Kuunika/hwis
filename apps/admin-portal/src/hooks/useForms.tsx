import { createFormService, Form } from "@/services";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const getForms = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createFormService()
      .getAll<Form>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["forms"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useAddForm = () => {
  const queryClient = useQueryClient();
  const addData = (event: Form) =>
    createFormService()
      .create(event)
      .then((response) => response.data);
  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
};

export const useForm = () => ({ getForms, useAddForm });
