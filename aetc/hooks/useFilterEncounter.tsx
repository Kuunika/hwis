import { useEffect, useState } from "react";
import { getPatientsEncounters } from "./encounter";

export const useFindPatientEncounter = (
  patientId: string,
  encounter: string
) => {
  const { data, isLoading, isRefetching } = getPatientsEncounters(
    patientId as string
  );
  const patientEncounter = data?.find((enc) => {
    return enc.encounter_type.uuid === encounter;
  });
  const [dataObs, setDataObs] = useState<any>([]);

  useEffect(() => {
    if (patientEncounter) {
      setDataObs(patientEncounter.obs);
    }
  }, [patientEncounter]);

  return { dataObs, isLoading: isRefetching || isLoading };
};
