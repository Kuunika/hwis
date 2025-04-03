import { conceptNames, concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";
import { useEffect, useState } from "react";

export const useDifferentialDiagnosis = (data:any) =>{
    const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

    useEffect(()=>{
        if(!data) return

        const additionalFieldsEncounter = data.find(
            (d:any) => d.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
        )

        if(!additionalFieldsEncounter?.obs) return;

        const getObservation = (conceptName: string) => {
            return additionalFieldsEncounter.obs.find((ob: Obs) =>
              ob.names.some((n) => n.name === conceptName)
            );
          };

          const observations = {
            pH: getObservation(concepts.PH),
            pC02: getObservation(concepts.PCO2),
          }

          console.log("*************",JSON.stringify(observations, null, 2));
          

        const allObservationDates =[
            observations.pH?.obs_datetime,
            observations.pC02?.obs_datetime,
        ].filter(Boolean);

        const observationDateTime = allObservationDates.length > 0 
        ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
        : new Date().toISOString();
  
      const formattedDate = new Date(observationDateTime).toLocaleString();
  
      let messages = [`Differential Diagnosis Assessment recorded on ${formattedDate}.\n`];

        if (observations.pH?.value) {
            messages.push(`PH is: ${observations.pH.value}. `);
          }

          if (observations.pC02?.value) {
            messages.push(`pC02 is: ${observations.pC02.value}. `);
          }
          setDifferentialDiagnosisMessage(messages.join(""));
    },[data]);

    return differentialDiagnosisMessage;
}