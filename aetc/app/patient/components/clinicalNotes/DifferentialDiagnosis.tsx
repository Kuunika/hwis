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
 
    //  console.log("Tione matenda",additionalFieldsEncounter)
    
    if (!additionalFieldsEncounter?.obs) return;

    const getObservation = (conceptName: string) => {
      return additionalFieldsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };

   
    const observations = {
      conditionValue: getObservation(concepts.CONDITION),
      

    };

    
    const allObservationDates = [
      observations.conditionValue?.obs_datetime,
      additionalFieldsEncounter.encounter_datetime
    ].filter(Boolean); 

   
    const observationDateTime = allObservationDates.length > 0 
      ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
      : new Date().toISOString();

    const formattedDate = new Date(observationDateTime).toLocaleString();

    let messages = [`Differential Diagnosis recorded on ${formattedDate}.\n`];

    // Temperature
    if (observations.conditionValue?.value) {
      messages.push(`Consitions Are: ${observations.conditionValue.value}. `);
    }

    

    setDifferentialDiagnosisMessage(messages.join(""));
  }, [pData]);

  return differentialDiagnosisMessage;
};