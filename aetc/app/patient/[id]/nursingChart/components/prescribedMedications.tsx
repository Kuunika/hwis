import { conceptNames, concepts, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import MedicationTable from "./minimalTable";
import MinimalTable from "./minimalTable";
import { Paper, Typography } from "@mui/material";

export const PrescribedMedication = () => {
  const { patientId, activeVisitId } = getActivePatientDetails();
  const { data } = getPatientsEncounters(patientId as string);

  const prescriptionEncounter = data?.filter((d) => {
    return (
      d.encounter_type.uuid == encounters.PRESCRIPTIONS &&
      d.visit_id == activeVisitId
    );
  });

  if (!prescriptionEncounter || prescriptionEncounter.length == 0) return;

  console.log(
    prescriptionEncounter[0].obs.filter(
      (ob) => ob.names[0].name == conceptNames.DRUG_GIVEN
    )
  );

  const med = prescriptionEncounter[0].obs
    .filter((ob) => ob.names[0].name == conceptNames.DRUG_GIVEN)
    .map((ob) => {
      const durationUnit = ob.children.find(
        (b) => b.names[0].name == conceptNames.MEDICATION_DURATION_UNIT
      )?.value;
      return {
        medicationName: ob.value,
        dose: ob.children.find(
          (b) => b.names[0].name == conceptNames.PRESCRIBED_DOSE
        )?.value,
        doseUnits: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_DOSE_UNIT
        )?.value,
        frequency: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_FREQUENCY
        )?.value,
        duration: `${
          ob.children.find(
            (b) => b.names[0].name == conceptNames.MEDICATION_DURATION
          )?.value
        } ${durationUnit}`,

        formulation: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_FORMULATION
        )?.value,
        description: ob.children.find(
          (b) => b.names[0].name == conceptNames.DESCRIPTION
        )?.value,
      };
    });

  return (
    <>
      <Typography>Prescribed Medication</Typography>
      <Paper sx={{ p: 1 }}>
        <MinimalTable
          columns={[
            { label: "Medication Name", field: "medicationName" },
            { label: "Dose", field: "dose" },
            { label: "Frequency", field: "frequency" },
            { label: "Duration", field: "duration" },
            { label: "Formulation", field: "formulation" },
          ]}
          data={med}
        />
      </Paper>
    </>
  );
};

//
