// import { useEffect, useState } from "react";
// import { concepts, encounters } from "@/constants";
// import { Obs } from "@/interfaces";

// export const useDifferentialDiagnosis = (pData: any) => {
//   const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (!pData) return;
  
//     const additionalFieldsEncounter = pData.find(
//       (d: any) => d.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
//     );
 
//      console.log("Tione makhwala ali apa eti??:",additionalFieldsEncounter)
    
//     if (!additionalFieldsEncounter?.obs) return;

//     const getObservation = (conceptName: string) => {
//       return additionalFieldsEncounter.obs.find((ob: Obs) =>
//         ob.names.some((n) => n.name === conceptName)
//       );
//     };

   
//     const observations = {
//       conditionValue: getObservation(concepts.CONDITION),
      

//     };

    
//     // const allObservationDates = [
//     //   observations.conditionValue?.obs_datetime,
//     //   additionalFieldsEncounter.encounter_datetime
//     // ].filter(Boolean); 

   
//     // const observationDateTime = allObservationDates.length > 0 
//     //   ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
//     //   : new Date().toISOString();

//     // const formattedDate = new Date(observationDateTime).toLocaleString();

//     let messages = [`Differential Diagnosis recorded on:\n`]; //[`Differential Diagnosis recorded on ${formattedDate}.\n`];

//     // Temperature
//     if (observations.conditionValue?.value) {
//       messages.push(`Consitions Are: ${observations.conditionValue.value}. `);
//     }

    

//     setDifferentialDiagnosisMessage(messages.join(""));
//   }, [pData]);

//   return differentialDiagnosisMessage;
// };





// import { useEffect, useState } from "react";
// import { concepts, encounters } from "@/constants";
// import { Obs } from "@/interfaces";

// export const useDifferentialDiagnosis = (pData: any) => {
//   const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (!pData) return;

//     // Find the relevant encounter with OUTPATIENT_DIAGNOSIS
//     const additionalFieldsEncounter = pData.find(
//       (d: any) => d.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
//     );

//     // Log the found encounter to verify its data
//     console.log("Tione makhwala ali apa eti??:", additionalFieldsEncounter);
    
//     // If no observations exist in the encounter, exit early
//     if (!additionalFieldsEncounter?.obs) return;

//     // Function to find observations by a given condition text
//     const getObservation = (condition: string) => {
//       return additionalFieldsEncounter.obs.find((ob: Obs) =>
//         ob.value_text && ob.value_text.includes(condition)
//       );
//     };

//     // Get observations for specific conditions (differential diagnoses)
//     const observations = {
//       intermittentFever: getObservation("intermittent fever"),
//       malposture: getObservation("malposture"),
//       transportFever: getObservation("transport fever"),
//     };

//     let messages = [`Differential Diagnosis recorded on:\n`];

//     // If conditions are found, add them to the message
//     if (observations.intermittentFever?.value_text) {
//       messages.push(`Condition: ${observations.intermittentFever.value_text}. `);
//     }
//     if (observations.malposture?.value_text) {
//       messages.push(`Condition: ${observations.malposture.value_text}. `);
//     }
//     if (observations.transportFever?.value_text) {
//       messages.push(`Condition: ${observations.transportFever.value_text}. `);
//     }

//     // Set the final differential diagnosis message
//     setDifferentialDiagnosisMessage(messages.join(""));
//   }, [pData]);

//   return differentialDiagnosisMessage;
// };


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
      messages.push(`Condition: ${obs}. `);
    });

    setDifferentialDiagnosisMessage(messages.join(""));
  }, [pData]);

  return differentialDiagnosisMessage;
};

