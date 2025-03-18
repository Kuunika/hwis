import { useEffect } from "react";
import { getPatientsEncounters } from "./encounter";
import { getActivePatientDetails } from "./getActivePatientDetails";

export const encounterObs = (encounters: Array<string>) => {
  const { patientId } = getActivePatientDetails();
  const { data } = getPatientsEncounters(patientId as string);

  useEffect(() => {
    if (!data) return;

    //   const presentingComplaints = data.find(
    //     (d) => d.encounter_type.uuid === encounters
    //   );

    //   const presentingComplaintsObs = presentingComplaints?.obs.filter((ob) =>
    //     ob.names.some((n) => n.name === concepts.PRESENTING_COMPLAINTS)
    //   );

    //   console.log({ presentingComplaintsObs });
  }, [data]);
};
