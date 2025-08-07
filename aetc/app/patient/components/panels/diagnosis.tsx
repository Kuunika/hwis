import { MinimalTable } from "@/components/tables/minimalTable";
import { encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useEffect, useState } from "react";
import { Panel } from "./panel";

export const DiagnosisTabDisplay = () => {
  const { params } = useParameters();
  const { data: patientEncounters, refetch } = getPatientsEncounters(
    params.id as string,
    `encounter_type=${encounters.OUTPATIENT_DIAGNOSIS}`
  );
  type DiagnosisRecord = {
    id: string;
    condition: string;
    obsDatetime: string;
    diagnosisType: string;
  };
  const [diagnosisList, setDiagnosisList] = useState<DiagnosisRecord[]>([]);

  useEffect(() => {
    if (patientEncounters) {
      const diagnosisRecords = patientEncounters.flatMap((encounter) =>
        encounter.obs.map((obs) => ({
          id: obs.obs_id.toString(),
          condition: obs.value_text ?? "", // Ensure condition is always a string
          obsDatetime: obs.obs_datetime || "",
          diagnosisType: obs.names[0]?.name
            .toLowerCase()
            .includes("differential")
            ? "Differential Diagnosis"
            : obs.names[0]?.name,
          diagnosis: obs.names,
        }))
      );

      console.log({ object: diagnosisRecords });
      setDiagnosisList(diagnosisRecords);
    }
  }, [patientEncounters]);

  return (
    <Panel title="Diagnosis">
      <MinimalTable
        columns={[
          { label: "Condition", field: "condition" },
          { label: "Diagnosis Type", field: "diagnosisType" },
        ]}
        data={diagnosisList}
      />
    </Panel>
  );
};
