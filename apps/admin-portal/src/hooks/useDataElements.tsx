import { DataElement, createDataElementService } from "@/services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getDataElements = (queryString?: string, enabled = true) => {
  const fetchEvents = () =>
    createDataElementService()
      .getAll<DataElement>()
      .then((res) => res.data);

  return useQuery({
    queryKey: ["dataElements"],
    queryFn: fetchEvents,
    enabled,
  });
};

export const useAddDataElement = () => {
  const queryClient = useQueryClient();
  const addData = (event: DataElement) =>
    createDataElementService()
      .create(event)
      .then((response) => response.data);
  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["dataElements"],
      });
    },
  });
};

export const useDataElements = () => ({ getDataElements, useAddDataElement });
