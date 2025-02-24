import { useEffect, useState } from "react";
import { addEncounter, fetchConceptAndCreateEncounter } from "./encounter";
import { useParameters } from "./navigation";
import { getPatientVisitTypes } from "./patientReg";
import { getDateTime } from "@/helpers/dateTime";

export const useSubmitEncounter = (
  encounterType: string,
  onDataSubmitComplete: () => void
) => {
  const { mutate, isSuccess, isPending, data } = fetchConceptAndCreateEncounter();
  const { params } = useParameters();
  const { data: patientVisits, isLoading } = getPatientVisitTypes(
    params?.id as string
  );
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  const handleSubmit = async (obs: Array<any>) => {
    const dateTime = getDateTime();

    console.log({ obs });

    await mutate({
      encounterType,
      visit: activeVisit?.uuid,
      patient: params.id,
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
