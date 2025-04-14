import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useDifferentialDiagnosis = (pData: any) => {
  const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

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


    let messages = [`Differential Diagnosis recorded on:\n`];

    observations.forEach((obs:any) => {
      messages.push(`The Differential Diagnosis are: ${obs}. `);
    });

    setDifferentialDiagnosisMessage(messages.join(""));
  }, [pData]);

  return differentialDiagnosisMessage;
};

