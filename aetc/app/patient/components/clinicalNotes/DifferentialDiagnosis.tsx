import { conceptNames, concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";
import { useEffect, useState } from "react";


export const useDifferentialDiagnosis = (data:any) =>{
    const [differentialDiagnosisMessage, setDifferentialDiagnosisMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!data) return;
      
        const fieldsEncounter = data.find(
          (d: any) => d.encounter_type.uuid === encounters.BED_SIDE_TEST
        );
      
        if (!fieldsEncounter?.obs) return;
      
        const getObservation = (conceptName: string) => {
          return fieldsEncounter.obs.find((ob: Obs) =>
            ob.names.some((n) => n.name === conceptName)
          );
        };
      
        const observations = {
          sampleTypeValue: getObservation(concepts.BLOOD_SAMPLE),
          // Keeping your commented-out observations
          // testsValue: getObservation(concepts.TESTS),
          // emergencyValue: getObservation(concepts.EMERGECY),
          // urgentSampleValue: getObservation(concepts.URGENT_SAMPLE)
        };
      
        // Only include dates from the observations we're actually using
        const allObservationDates = [
          observations.sampleTypeValue?.obs_datetime,
          // Uncomment these if you enable the other observations
          // observations.testsValue?.obs_datetime,
          // observations.emergencyValue?.obs_datetime,
          // observations.urgentSampleValue?.obs_datetime
        ].filter(Boolean);
      
        const observationDateTime = allObservationDates.length > 0
          ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
          : new Date().toISOString();
      
        const formattedDate = new Date(observationDateTime).toLocaleString();
      
        let messages = [`Blood Sample Assessment recorded on ${formattedDate}.\n`];
      
        if (observations.sampleTypeValue?.value) {
          messages.push(`Blood Sample Type: ${observations.sampleTypeValue.value}. `);
        }
      
        // Uncomment these if you enable the other observations
        // if (observations.testsValue?.value) {
        //   messages.push(`Test Type: ${observations.testsValue.value}. `);
        // }
        // if (observations.emergencyValue?.value) {
        //   messages.push(`Emergency Status: ${observations.emergencyValue.value}. `);
        // }
        // if (observations.urgentSampleValue?.value) {
        //   messages.push(`Urgent Sample: ${observations.urgentSampleValue.value}. `);
        // }
      
        setDifferentialDiagnosisMessage(messages.join(""));
      
      }, [data]);

    useEffect(()=>{
        if(!data) return

        const fieldsEncounter = data.find(
            (d:any) => d.encounter_type.uuid === encounters.BED_SIDE_TEST
        )

        if(!fieldsEncounter?.obs) return;

        const getObservation = (conceptName: string) => {
            return fieldsEncounter.obs.find((ob: Obs) =>
              ob.names.some((n) => n.name === conceptName)
            );
          };
    
          const observations = {
            MRDT:getObservation(concepts.MRDT),
            pH: getObservation(concepts.PH),
            pC02: getObservation(concepts.PCO2),
            metabolicValues: getObservation(concepts.LACTATE),
            metabolicValues1: getObservation(concepts.GLUCOSE),
            acidStatus: getObservation(concepts.HCO3),
            acidStatus1: getObservation(concepts.ANION_GAPC),
            acidStatus2: getObservation(concepts.MOSMC),
            oxymetryValues: getObservation(concepts.SO2E),
            oxymetryValues1: getObservation(concepts.FO2HBE),
            oxymetryValues2: getObservation(concepts.FHHBE),
            electrolyteValues: getObservation(concepts.CK),
            electrolyteValues1: getObservation(concepts.CNA),
            electrolyteValues2: getObservation(concepts.CA2),
            electrolyteValues3: getObservation(concepts.CCL),
            temperatureCorrectedteValues: getObservation(concepts.PH),
            temperatureCorrectedteValues1: getObservation(concepts.PCO2),
            temperatureCorrectedteValues2: getObservation(concepts.PO2),
            temperatureCorrectedteValues3: getObservation(concepts.P50E),
            pregnancyTestValues: getObservation(concepts.PREGNANCY_TEST),
            hivValues: getObservation(concepts.HIV),
            VDRLValues: getObservation(concepts.VDRL),
            UROBILINOGENValues: getObservation(concepts.UROBILINOGEN),
            pHValues: getObservation(concepts.PH),
            LEUKOCYTESValues: getObservation(concepts.LEUKOCYTES),
            glucoseValues: getObservation(concepts.GLUCOSE),
            specificGravityValues: getObservation(concepts.SPECIFIC_GRAVITY),
            nitrateValues: getObservation(concepts.NITRITE),
            ketonesVales: getObservation(concepts.KETONES),
            bilirubinVales: getObservation(concepts.BILIRUBIN),
            bloodValues: getObservation(concepts.BLOOD),
            ultraSoundValues: getObservation(concepts.POINT_OF_CARE_ULTRASOUND),
            ecgValues: getObservation(concepts.ECG),
            pefrValues: getObservation(concepts.PEFR),
            otherValues: getObservation(concepts.OTHER),
          }       

          const allObservationDates = [
            observations.MRDT?.obs_datetime,
            observations.pH?.obs_datetime,
            observations.pC02?.obs_datetime,
            observations.metabolicValues?.obs_datetime,
            observations.metabolicValues1?.obs_datetime,
            observations.acidStatus?.obs_datetime,
            observations.acidStatus1?.obs_datetime,
            observations.acidStatus2?.obs_datetime,
            observations.oxymetryValues?.obs_datetime,
            observations.oxymetryValues1?.obs_datetime,
            observations.oxymetryValues2?.obs_datetime,
            observations.electrolyteValues?.obs_datetime,
            observations.electrolyteValues1?.obs_datetime,
            observations.electrolyteValues2?.obs_datetime,
            observations.electrolyteValues3?.obs_datetime,
            observations.temperatureCorrectedteValues?.obs_datetime,
            observations.temperatureCorrectedteValues1?.obs_datetime,
            observations.temperatureCorrectedteValues2?.obs_datetime,
            observations.temperatureCorrectedteValues3?.obs_datetime,
            observations.pregnancyTestValues?.obs_datetime,
            observations.hivValues?.obs_datetime,
            observations.VDRLValues?.obs_datetime,
            observations.UROBILINOGENValues?.obs_datetime,
            observations.LEUKOCYTESValues?.obs_datetime,
            observations.glucoseValues?.obs_datetime,
            observations.specificGravityValues?.obs_datetime,
            observations.nitrateValues?.obs_datetime,
            observations.ketonesVales?.obs_datetime,
            observations.bilirubinVales?.obs_datetime,
            observations.bloodValues?.obs_datetime,
            observations.ultraSoundValues?.obs_datetime,
            observations.ecgValues?.obs_datetime,
            observations.pefrValues?.obs_datetime,
            observations.otherValues?.obs_datetime
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

      if (observations.MRDT?.value) {
        messages.push(`MRDT result: ${observations.MRDT.value}. `);
      }

      if (observations.metabolicValues?.value) {
        messages.push(`Lactate level: ${observations.metabolicValues.value}. `);
      }

      if (observations.metabolicValues1?.value) {
        messages.push(`Glucose level: ${observations.metabolicValues1.value}. `);
      }

      if (observations.acidStatus?.value) {
        messages.push(`HCO3 level: ${observations.acidStatus.value}. `);
      }

      if (observations.acidStatus1?.value) {
        messages.push(`Anion Gap: ${observations.acidStatus1.value}. `);
      }

      if (observations.acidStatus2?.value) {
        messages.push(`MOSMC: ${observations.acidStatus2.value}. `);
      }

      if (observations.oxymetryValues?.value) {
        messages.push(`SO2E: ${observations.oxymetryValues.value}. `);
      }

      if (observations.oxymetryValues1?.value) {
        messages.push(`FO2HBE: ${observations.oxymetryValues1.value}. `);
      }

      if (observations.oxymetryValues2?.value) {
        messages.push(`FHHBE: ${observations.oxymetryValues2.value}. `);
      }

      if (observations.electrolyteValues?.value) {
        messages.push(`CK level: ${observations.electrolyteValues.value}. `);
      }

      if (observations.electrolyteValues1?.value) {
        messages.push(`Sodium level: ${observations.electrolyteValues1.value}. `);
      }

      if (observations.electrolyteValues2?.value) {
        messages.push(`Calcium level: ${observations.electrolyteValues2.value}. `);
      }

      if (observations.electrolyteValues3?.value) {
        messages.push(`Chloride level: ${observations.electrolyteValues3.value}. `);
      }

      if (observations.temperatureCorrectedteValues?.value) {
        messages.push(`Temperature corrected pH: ${observations.temperatureCorrectedteValues.value}. `);
      }

      if (observations.temperatureCorrectedteValues1?.value) {
        messages.push(`Temperature corrected pCO2: ${observations.temperatureCorrectedteValues1.value}. `);
      }

      if (observations.temperatureCorrectedteValues2?.value) {
        messages.push(`Temperature corrected pO2: ${observations.temperatureCorrectedteValues2.value}. `);
      }

      if (observations.temperatureCorrectedteValues3?.value) {
        messages.push(`P50E: ${observations.temperatureCorrectedteValues3.value}. `);
      }

      if (observations.pregnancyTestValues?.value) {
        messages.push(`Pregnancy test result: ${observations.pregnancyTestValues.value}. `);
      }

      if (observations.hivValues?.value) {
        messages.push(`HIV test result: ${observations.hivValues.value}. `);
      }

      if (observations.VDRLValues?.value) {
        messages.push(`VDRL result: ${observations.VDRLValues.value}. `);
      }

      if (observations.UROBILINOGENValues?.value) {
        messages.push(`Urobilinogen: ${observations.UROBILINOGENValues.value}. `);
      }

      if (observations.LEUKOCYTESValues?.value) {
        messages.push(`Leukocytes: ${observations.LEUKOCYTESValues.value}. `);
      }

      if (observations.glucoseValues?.value) {
        messages.push(`Urine glucose: ${observations.glucoseValues.value}. `);
      }

      if (observations.specificGravityValues?.value) {
        messages.push(`Specific gravity: ${observations.specificGravityValues.value}. `);
      }

      if (observations.nitrateValues?.value) {
        messages.push(`Nitrite: ${observations.nitrateValues.value}. `);
      }

      if (observations.ketonesVales?.value) {
        messages.push(`Ketones: ${observations.ketonesVales.value}. `);
      }

      if (observations.bilirubinVales?.value) {
        messages.push(`Bilirubin: ${observations.bilirubinVales.value}. `);
      }

      if (observations.bloodValues?.value) {
        messages.push(`Blood presence: ${observations.bloodValues.value}. `);
      }

      if (observations.ultraSoundValues?.value) {
        messages.push(`Point of care ultrasound findings: ${observations.ultraSoundValues.value}. `);
      }

      if (observations.ecgValues?.value) {
        messages.push(`ECG findings: ${observations.ecgValues.value}. `);
      }

      if (observations.pefrValues?.value) {
        messages.push(`PEFR: ${observations.pefrValues.value}. `);
      }

      if (observations.otherValues?.value) {
        messages.push(`Other findings: ${observations.otherValues.value}. `);
      }

      setDifferentialDiagnosisMessage(messages.join(""));
    },[data]);

    return differentialDiagnosisMessage;
}