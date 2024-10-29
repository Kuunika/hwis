import { useEffect, useState } from "react";
import { addEncounter } from "./encounter";
import { useParameters } from "./navigation";
import { getPatientVisitTypes } from "./patientReg";
import { getDateTime } from "@/helpers/dateTime";
import { getObservations } from "@/helpers";
import { Obs } from "@/interfaces";

export const useSubmitEncounter = (
  encounterType: string,
  onDataSubmitComplete: () => void
) => {
  const { mutate, isSuccess, isPending } = addEncounter();
  const { params } = useParameters();
  const { data: patientVisits, isLoading } = getPatientVisitTypes(
    params?.id as string
  );
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  const handleSubmit = async (obs: Array<any>) => {
    const dateTime = getDateTime();
    await mutate({
      encounterType,
      visit: activeVisit?.uuid,
      patient: params.id,
      dateTime,
      obs,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onDataSubmitComplete();
    }
  }, [isSuccess]);

  return { isLoading, isSuccess, handleSubmit };
};
