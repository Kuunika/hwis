import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useFinalDiagnosis = (pData: any) => {
  const [finalDiagnosisMessage, setFinalDiagnosisMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;

    const additionalFieldsEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
    );

    if (!additionalFieldsEncounter?.obs) return;

    // Filter observations to only include those with name "Final Diagnosis"
    const finalDiagnosisObservations = additionalFieldsEncounter.obs
      .filter((ob: Obs) => 
        ob.names?.some((name: any) => name.name === "Final Diagnosis")
      )
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (finalDiagnosisObservations.length === 0) return;
  
    const createdBy = additionalFieldsEncounter.created_by;

    let messages = [
      `Final Diagnosis recorded on:\n`,
      `The Final Diagnosis are: ${finalDiagnosisObservations.join(", ")}`,
      `\n\nCreated by: ${createdBy}`
    ];

    setFinalDiagnosisMessage(messages.join(""));
  }, [pData]);

  return finalDiagnosisMessage;
};