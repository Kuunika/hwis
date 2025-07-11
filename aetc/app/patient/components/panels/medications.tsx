import { MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";

import { PrescribedMedicationList } from "../../[id]/nursingChart/components/prescribedMedicationList";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters } from "@/constants";
import { useVisitDates } from "@/contexts/visitDatesContext";
import { formatDispensedMedicationObs } from "../../[id]/nursingChart/components/drugDispensedList";
import { MinimalTable } from "@/components/tables/minimalTable";
import { useEffect, useState } from "react";

export const Medications = () => {
  const { params } = useParameters();
  const { selectedVisit } = useVisitDates();
  const { data: patientEncounters, refetch } = getPatientsEncounters(
    params.id as string,
    `encounter_type=${encounters.DISPENSING}&visit=${selectedVisit?.uuid}`
  );
  const [rows, setRows] = useState<
    {
      route: any;
      dose: any;
      createdBy: string;
      createdTime: string;
      medication: any;
    }[]
  >([]);

  useEffect(() => {
    if (patientEncounters && patientEncounters.length > 0) {
      console.log(patientEncounters[0].obs);
      const dataRows = formatDispensedMedicationObs(patientEncounters[0].obs);
      setRows(dataRows);
    }
  }, [patientEncounters]);

  return (
    <Panel title="Medications">
      <br />
      <PrescribedMedicationList />
      <br />
      <h3>Despensed Medicines</h3>
      <MinimalTable
        columns={[
          { label: "Medication Name", field: "medication" },
          { label: "Dose", field: "dose" },
          { label: "Route", field: "route" },
          { label: "Dispensed Time", field: "createdTime" },
          { label: "Dispenser", field: "createdBy" },
        ]}
        data={rows ? rows : []}
      />
    </Panel>
  );
};
