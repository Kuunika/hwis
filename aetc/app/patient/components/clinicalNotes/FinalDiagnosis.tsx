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


    //console.log("Tione makhwala ali apa eti??:", additionalFieldsEncounter);

    if (!additionalFieldsEncounter?.obs) return;

    const observations = additionalFieldsEncounter.obs
      .map((ob: Obs) => ob.value) 
      .filter(Boolean); 

    if (observations.length === 0) return;


    let messages = [`Final Diagnosis recorded on:\n`];

    observations.forEach((obs:any) => {
      messages.push(`Condition: ${obs}. `);
    });

    setFinalDiagnosisMessage(messages.join(""));
  }, [pData]);

  return finalDiagnosisMessage;
};

