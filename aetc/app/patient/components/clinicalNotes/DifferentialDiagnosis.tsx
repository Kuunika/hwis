import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useDifferentialDiagnosis = (pData: any) => {
  const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;

    const additionalFieldsEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
    );

    if (!additionalFieldsEncounter?.obs) return;

    // Filter observations to only include those with name "Attempted/ Differential Diagnosis"
    const differentialDiagnosisObservations = additionalFieldsEncounter.obs
      .filter((ob: Obs) => 
        ob.names?.some((name: any) => name.name === concepts.DIFFERENTIAL_DIAGNOSIS ) //"Attempted/ Differential Diagnosis"
      )
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (differentialDiagnosisObservations.length === 0) return;

    const createdBy = additionalFieldsEncounter.created_by;
    let messages = [
      `Differential Diagnosis recorded on:\n`,
      `The Differential Diagnosis are: ${differentialDiagnosisObservations.join(", ")}`,
      `\n\nCreated by: ${createdBy}`
    ];

    setDifferentialDiagnosisMessage(messages.join(""));
  }, [pData]);

  return differentialDiagnosisMessage;
};
