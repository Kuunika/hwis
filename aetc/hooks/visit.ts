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
  const updateVisit = async (visitUuid: string) =>
    closeVisit(visitUuid, { stopDatetime: await getDateTime() }).then(
      (response) => response.data
    );

  return useMutation({
    mutationFn: updateVisit,
  });
};

export const reOpenRecentClosedVisit = (patientId: string) => {
  const queryClient = useQueryClient();
  const updateVisit = (visitUuid: string) =>
    closeVisit(visitUuid, { stopDatetime: "null" }).then(
      (response) => response.data
    );

  return useMutation({
    mutationFn: updateVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients", patientId, "visits"],
      });
    },
  });
};
