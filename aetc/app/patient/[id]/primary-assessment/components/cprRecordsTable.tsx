import { MinimalTable } from "@/components/tables/minimalTable";
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { useFindPatientEncounter } from "@/hooks/useFilterEncounter";
import { Obs } from "@/interfaces";
import { Typography } from "@mui/material";

export const CPRRecordTable = ({
  patientId,
  submittingRecord,
}: {
  patientId: string;
  submittingRecord: boolean;
}) => {
  const { dataObs, isLoading } = useFindPatientEncounter(
    patientId,
    encounters.CPR
  );

  const records = dataObs.filter(
    (ob: Obs) =>
      ob.children.length > 0 &&
      ob.names.find(
        (name) => name.name.toLowerCase() == concepts.CPR_RECORD.toLowerCase()
      )
  );

  console.log({ records });

  const formatted = records.map(({ children }: Obs) => {
    const time = getObservationValue(children, concepts.TIME);
    const shockEnergy = getObservationValue(children, concepts.SHOCK_ENERGY);
    const medicationName = getObservationValue(children, concepts.MEDICATION);
    const dose = getObservationValue(children, concepts.MEDICATION_DOSE);
    const doseUnit = getObservationValue(
      children,
      concepts.MEDICATION_DOSE_UNIT
    );
    const occurrences = getObservationValue(children, concepts.OCCURRENCES);

    const interventionList = children
      .filter((ob) =>
        ob?.names?.some(
          (obName) =>
            obName.name.toLowerCase() ===
            concepts.INTERVENTION_LIST.toLowerCase()
        )
      )
      .map((ob) => ob.value)
      .join(", ");

    const rhythm = children
      .filter((ob) =>
        ob?.names?.some(
          (obName) =>
            obName.name.toLowerCase() === concepts.RHYTHM.toLowerCase()
        )
      )
      .map((ob) => ob.value)
      .join(", ");

    const causes = children
      .filter((ob) =>
        ob?.names?.some(
          (obName) =>
            obName.name.toLowerCase() ===
            concepts.REVERSIBLE_CAUSES.toLowerCase()
        )
      )
      .map((ob) => ob.value)
      .join(", ");

    return {
      time,
      shockEnergy,
      medicationName,
      dose,
      doseUnit,
      occurrences,
      interventionList,
      rhythm,
      causes,
    };
  });

  return (
    <>
      <Typography variant="h5">Records</Typography>
      <br />
      <MinimalTable
        columns={[
          { label: "Time", field: "time" },
          { label: "Shock Energy", field: "shockEnergy" },
          { label: "Medication Name", field: "medicationName" },
          { label: "Dose", field: "dose" },
          { label: "Dose Unit", field: "doseUnit" },
          { label: "Occurrences", field: "occurrences" },
          { label: "Intervention List", field: "interventionList" },
          { label: "Rhythm", field: "rhythm" },
          { label: "Reversible Causes", field: "causes" },
        ]}
        loading={isLoading || submittingRecord}
        data={formatted}
      />
    </>
  );
};
