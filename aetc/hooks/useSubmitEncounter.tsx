import { useEffect, useState } from "react";
import { addEncounter, fetchConceptAndCreateEncounter } from "./encounter";
import { useParameters } from "./navigation";
import { getPatientVisitTypes } from "./patientReg";
import { useServerTime } from "@/contexts/serverTimeContext";

export const useSubmitEncounter = (
  encounterType: string,
  onDataSubmitComplete: () => void,
  patientuuid?: string,
  visitId?: string
) => {
  const { ServerTime } = useServerTime();
  const { mutate, isSuccess, isPending, data } =
    fetchConceptAndCreateEncounter();
  const { params } = useParameters();
  const { data: patientVisits, isLoading } = getPatientVisitTypes(
    params?.id as string
  );
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  const handleSubmit = async (obs: Array<any>) => {
    const dateTime = ServerTime.getServerTimeString();
    await mutate({
      encounterType,
      patient: patientuuid ? patientuuid : params.id,
      visit: visitId ? visitId : activeVisit?.uuid,
      encounterDatetime: dateTime,
      obs,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onDataSubmitComplete();
    }
  }, [isSuccess]);

  return { isLoading: isLoading || isPending, isSuccess, handleSubmit };
};
