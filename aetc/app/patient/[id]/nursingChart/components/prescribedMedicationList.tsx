import { OverlayLoader } from "@/components/backdrop";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { MinimalTable } from "@/components/tables/minimalTable";
import { conceptNames, concepts, encounters } from "@/constants";
import { usePrinterDialog } from "@/contexts/printer";
import { generateMedicationLabelZPL } from "@/helpers/zpl";
import { getActivePatientDetails } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Obs } from "@/interfaces";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export const PrescribedMedicationList = ({
  setRow,
}: {
  setRow?: (row: any) => void;
}) => {
  const { patientId, activeVisitId, activeVisit } = getActivePatientDetails();
  const {setZpl, setOpen}=usePrinterDialog()
  const {
    data,
    isPending: fetchingEncounters,
    isRefetching,
  } = getPatientsEncounters(patientId as string);
  const [rows, setRows] = useState<Array<any>>([]);

  const getValue = (ob: Obs, name: string) => {
    const value = ob?.children?.find(
      (b) => b.names && b.names[0].name == name
    )?.value;
    return value;
  };

  useEffect(() => {
    const prescriptionEncounter = data?.filter((d) => {
      return (
        d?.encounter_type?.uuid == encounters.PRESCRIPTIONS &&
        d.visit_id == activeVisitId
      );
    });

    if (!prescriptionEncounter || prescriptionEncounter.length == 0) return;

    const formattedRows = prescriptionEncounter[0].obs
      .filter((ob) => ob?.names && ob?.names[0].name == concepts.DRUG_GIVEN)
      .map((childObs) => {
        const durationUnit = getValue(
          childObs,
          conceptNames.MEDICATION_DURATION_UNIT
        );
        const dose = getValue(childObs, concepts.MEDICATION_DOSE);
        const description = getValue(childObs, conceptNames.DESCRIPTION);
        const formulation = getValue(
          childObs,
          conceptNames.MEDICATION_FORMULATION
        );
        const doseUnits = getValue(childObs, conceptNames.MEDICATION_DOSE_UNIT);
        const frequency = getValue(childObs, conceptNames.MEDICATION_FREQUENCY);
        const duration =
          getValue(childObs, conceptNames.MEDICATION_DURATION) +
          " " +
          durationUnit;

        const medicationUUID = childObs.value_coded_uuid;
        console.log({
          medicationName: childObs.value,
          durationUnit,
          dose,
          doseUnits,
          frequency,
          duration,
          formulation,
          description,
          prescribedBy: childObs.created_by,
        });

        return {
          medicationName: childObs.value,
          durationUnit,
          dose,
          doseUnits,
          frequency,
          duration,
          formulation,
          description,
          prescribedBy: childObs.created_by,
          medicationUUID,
        };
      })
      .filter((medication) => medication.description == "current");

    console.log({ formattedRows });

    setRows(formattedRows);
  }, [data]);


  const handleMedicationPrint = ()=>{
    const zpl =generateMedicationLabelZPL(rows);
    setOpen(zpl)
    setZpl(zpl)
  }

  return (
    <ContainerLoaderOverlay loading={fetchingEncounters}>
      <Button onClick={handleMedicationPrint} variant="contained">Print Medications</Button>
      <br />
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
