import { OverlayLoader } from "@/components/backdrop";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { MinimalTable } from "@/components/tables/minimalTable";
import { conceptNames, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Encounter } from "@/interfaces";

export const PrescribedMedicationList = ({
  setRow,
}: {
  setRow?: (row: any) => void;
}) => {
  const { patientId, activeVisitId, activeVisit } = getActivePatientDetails();
  const {
    data,
    isPending: fetchingEncounters,
    isRefetching,
  } = getPatientsEncounters(patientId as string);

  const prescriptionEncounter = data?.filter((d) => {
    return (
      d.encounter_type.uuid == encounters.PRESCRIPTIONS &&
      d.visit_id == activeVisitId
    );
  });

  if (!prescriptionEncounter || prescriptionEncounter.length == 0) return;

  const rows = prescriptionEncounter[0].obs
    .filter((ob) => ob.names[0].name == conceptNames.DRUG_GIVEN)
    .map((ob) => {
      const durationUnit = ob.children.find(
        (b) => b.names[0].name == conceptNames.MEDICATION_DURATION_UNIT
      )?.value;
      return {
        medicationName: ob.value,
        medicationUUID: ob.value_coded_uuid,
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
        prescribedBy: ob.created_by,
      };
    });

  return (
    <ContainerLoaderOverlay loading={fetchingEncounters}>
      <MinimalTable
        getSelectedRow={setRow}
        columns={[
          { label: "Medication Name", field: "medicationName" },
          { label: "Dose", field: "dose" },
          { label: "Frequency", field: "frequency" },
          { label: "Duration", field: "duration" },
          { label: "Formulation", field: "formulation" },
          { label: "Prescriber", field: "prescribedBy" },
        ]}
        data={rows}
      />
    </ContainerLoaderOverlay>
  );
};
