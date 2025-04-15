import { getDateTime } from "@/helpers/dateTime";
import { closeVisit, createVisit } from "@/services/visit";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const addVisit = () => {
  const queryClient = useQueryClient();
  const addData = (visit: any) =>
    createVisit(visit).then((response) => response.data);

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["visits"],
      });
    },
  });
};
export const closeCurrentVisit = () => {
  const updateVisit = (visitUuid: string) =>
    closeVisit(visitUuid, { stopDatetime: getDateTime() }).then(
      (response) => response.data
    );

  return useMutation({
    mutationFn: updateVisit,

  });
};
