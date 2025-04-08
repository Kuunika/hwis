import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const usePatientManagementPlan = (pData: any) => {
  const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>('');
//   const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>(null);
//   const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>(null);
//   const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>(null);



  useEffect(() => {
    if (!pData) return;
  
    const additionalFieldsEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.NON_PHARMACOLOGICAL
    );
    
   console.log("usiku activities",additionalFieldsEncounter)
   
    if (!additionalFieldsEncounter?.obs) return;

    const getObservation = (conceptName: string) => {
      return additionalFieldsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };

    const observations = {
      MinorSurgery: getObservation(concepts.MINOR_SURGERY),
      Suturing: getObservation(concepts.SUTURING),
      JointReduction: getObservation(concepts.JOINT_REDUCTION),
      FractureReduction: getObservation(concepts.FRACTURE_REDUCTION),
      IntercostalDrainInsertion: getObservation(concepts.INTERCOSTAL_DRAIN_INSERTION),
      Pleurocentesis: getObservation(concepts.PLEUROCENTESIS),
      Pericardiocentesis: getObservation(concepts.PERICARDIOCENTESISI),
      Paracentesis: getObservation(concepts.PARACENTESISI),
      LumbarPuncture: getObservation(concepts.LUMBER_PUNCTURE),
      IntravenousCannulation: getObservation(concepts.INTRAVENOUS_CANNULATION),
      CentralLineInsertion: getObservation(concepts.CENTRAL_LINE_INSERTION),
      UrethralCatheterization: getObservation(concepts.CATHETERIZATION_URETHRAL),
      SuprapubicCatheterization: getObservation(concepts.CATHETERIZATION_SUPRAPUBIC),
      Suctioning: getObservation(concepts.SUCTIONING),
      OropharyngealAirwayInsertion: getObservation(concepts.OROPHARYNGEAL_AIRWAY_INSERTION),
      NasopharyngealAirwayInsertion: getObservation(concepts.NASOPHARYNGEAL_AIRWAY_INSERTION),
      LaryngealMaskAirwayInsertion: getObservation(concepts.LARYNGEAL_MASK_AIRWAY_INSERTION),
      EndotrachealTubeInsertion: getObservation(concepts.ENDOTRACHEAL_TUBE_INSERTION),
      NasogastricTubeInsertion: getObservation(concepts.NASOGASTRIC_TUBE_INSERTION),
      ManualVentilation: getObservation(concepts.MANUAL_VENTILATION),
      ContinuousPositiveAirwayPressure: getObservation(concepts.CONTINUOUS_POSITIVE_AIRWAY_PRESSURE),
      WoundDressing: getObservation(concepts.WOUND_DRESSING),
      PatientEducation: getObservation(concepts.PATIENT_EDUCATION),
      Counselling: getObservation(concepts.COUNSELLING),
      Feeding: getObservation(concepts.FEEDING),
      Oxygenation: getObservation(concepts.OXYGENATION),
      ElectrocardiographMonitoring: getObservation(concepts.ELECTROCARDIOGRAPHY_MONITORING),
      TurningPatients: getObservation(concepts.TURNING_PATIENTS),
      OralCare: getObservation(concepts.ORAL_CARE),
    };

    const allObservationDates = [
      observations.MinorSurgery?.obs_datetime,
      observations.Suturing?.obs_datetime,
      observations.JointReduction?.obs_datetime,
      observations.FractureReduction?.obs_datetime,
      observations.IntercostalDrainInsertion?.obs_datetime,
      observations.Pleurocentesis?.obs_datetime,
      observations.Pericardiocentesis?.obs_datetime,
      observations.Paracentesis?.obs_datetime,
      observations.LumbarPuncture?.obs_datetime,
      observations.IntravenousCannulation?.obs_datetime,
      observations.CentralLineInsertion?.obs_datetime,
      observations.UrethralCatheterization?.obs_datetime,
      observations.SuprapubicCatheterization?.obs_datetime,
      observations.Suctioning?.obs_datetime,
      observations.OropharyngealAirwayInsertion?.obs_datetime,
      observations.NasopharyngealAirwayInsertion?.obs_datetime,
      observations.LaryngealMaskAirwayInsertion?.obs_datetime,
      observations.EndotrachealTubeInsertion?.obs_datetime,
      observations.NasogastricTubeInsertion?.obs_datetime,
      observations.ManualVentilation?.obs_datetime,
      observations.ContinuousPositiveAirwayPressure?.obs_datetime,
      observations.WoundDressing?.obs_datetime,
      observations.PatientEducation?.obs_datetime,
      observations.Counselling?.obs_datetime,
      observations.Feeding?.obs_datetime,
      observations.Oxygenation?.obs_datetime,
      observations.ElectrocardiographMonitoring?.obs_datetime,
      observations.TurningPatients?.obs_datetime,
      observations.OralCare?.obs_datetime,
      additionalFieldsEncounter.encounter_datetime
    ].filter(Boolean); 

    const observationDateTime = allObservationDates.length > 0 
      ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
      : new Date().toISOString();

    const formattedDate = new Date(observationDateTime).toLocaleString();

    let messages = [`Non-Pharmacological Management Plan recorded on ${formattedDate}.\n`];

    // Add messages for all observations
    if (observations.MinorSurgery?.value) {
      messages.push(`Minor Surgery: ${observations.MinorSurgery.value}. `);
    }
    
    if (observations.Suturing?.value) {
      messages.push(`Suturing: ${observations.Suturing.value}. `);
    }
    if (observations.JointReduction?.value) {
      messages.push(`Joint Reduction: ${observations.JointReduction.value}. `);
    }
    if (observations.FractureReduction?.value) {
      messages.push(`Fracture Reduction: ${observations.FractureReduction.value}. `);
    }
    if (observations.IntercostalDrainInsertion?.value) {
      messages.push(`Intercostal Drain Insertion: ${observations.IntercostalDrainInsertion.value}. `);
    }
    if (observations.Pleurocentesis?.value) {
      messages.push(`Pleurocentesis: ${observations.Pleurocentesis.value}. `);
    }
    if (observations.Pericardiocentesis?.value) {
      messages.push(`Pericardiocentesis: ${observations.Pericardiocentesis.value}. `);
    }
    if (observations.Paracentesis?.value) {
      messages.push(`Paracentesis: ${observations.Paracentesis.value}. `);
    }
    if (observations.LumbarPuncture?.value) {
      messages.push(`Lumbar Puncture: ${observations.LumbarPuncture.value}. `);
    }
    if (observations.IntravenousCannulation?.value) {
      messages.push(`IV Cannulation: ${observations.IntravenousCannulation.value}. `);
    }
    if (observations.CentralLineInsertion?.value) {
      messages.push(`Central Line Insertion: ${observations.CentralLineInsertion.value}. `);
    }
    if (observations.UrethralCatheterization?.value) {
      messages.push(`Urethral Catheterization: ${observations.UrethralCatheterization.value}. `);
    }
    if (observations.SuprapubicCatheterization?.value) {
      messages.push(`Suprapubic Catheterization: ${observations.SuprapubicCatheterization.value}. `);
    }
    if (observations.Suctioning?.value) {
      messages.push(`Suctioning: ${observations.Suctioning.value}. `);
    }
    if (observations.OropharyngealAirwayInsertion?.value) {
      messages.push(`Oropharyngeal Airway: ${observations.OropharyngealAirwayInsertion.value}. `);
    }
    if (observations.NasopharyngealAirwayInsertion?.value) {
      messages.push(`Nasopharyngeal Airway: ${observations.NasopharyngealAirwayInsertion.value}. `);
    }
    if (observations.LaryngealMaskAirwayInsertion?.value) {
      messages.push(`Laryngeal Mask Airway: ${observations.LaryngealMaskAirwayInsertion.value}. `);
    }
    if (observations.EndotrachealTubeInsertion?.value) {
      messages.push(`Endotracheal Tube: ${observations.EndotrachealTubeInsertion.value}. `);
    }
    if (observations.NasogastricTubeInsertion?.value) {
      messages.push(`Nasogastric Tube: ${observations.NasogastricTubeInsertion.value}. `);
    }
    if (observations.ManualVentilation?.value) {
      messages.push(`Manual Ventilation: ${observations.ManualVentilation.value}. `);
    }
    if (observations.ContinuousPositiveAirwayPressure?.value) {
      messages.push(`CPAP: ${observations.ContinuousPositiveAirwayPressure.value}. `);
    }
    if (observations.WoundDressing?.value) {
      messages.push(`Wound Dressing: ${observations.WoundDressing.value}. `);
    }
    if (observations.PatientEducation?.value) {
      messages.push(`Patient Education: ${observations.PatientEducation.value}. `);
    }
    if (observations.Counselling?.value) {
      messages.push(`Counselling: ${observations.Counselling.value}. `);
    }
    if (observations.Feeding?.value) {
      messages.push(`Feeding: ${observations.Feeding.value}. `);
    }
    if (observations.Oxygenation?.value) {
      messages.push(`Oxygenation: ${observations.Oxygenation.value}. `);
    }
    if (observations.ElectrocardiographMonitoring?.value) {
      messages.push(`ECG Monitoring: ${observations.ElectrocardiographMonitoring.value}. `);
    }
    if (observations.TurningPatients?.value) {
      messages.push(`Turning Patients: ${observations.TurningPatients.value}. `);
    }
    if (observations.OralCare?.value) {
      messages.push(`Oral Care: ${observations.OralCare.value}. `);
    }

    setPatientManagementPlanMessage(messages.join(""));
  }, [pData]);


  useEffect(() => {
    if (!pData) return;
  
    const additionalFieldsEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PATIENT_CARE_AREA
    );

    console.log("Tione zaku surgical",additionalFieldsEncounter)
    
    if (!additionalFieldsEncounter?.obs) return;
  
    const getObservation = (conceptName: string) => {
      return additionalFieldsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };
  
    const observations = {
      surgical: getObservation(concepts.SURGICAL),
      MedicalBench: getObservation(concepts.MEDICAL_BENCH),
      ShortStay: getObservation(concepts.SHORT_STAY),
      isoloation: getObservation(concepts.ISOLATION),
      trauma: getObservation(concepts.TRAUMA),
    };
  
   
    const allObservationDates = [
      observations.surgical?.obs_datetime,
      observations.MedicalBench?.obs_datetime,
      observations.ShortStay?.obs_datetime,
      observations.isoloation?.obs_datetime,
      observations.trauma?.obs_datetime,
      additionalFieldsEncounter.encounter_datetime
    ].filter(Boolean);
  
 
    const observationDateTime = allObservationDates.length > 0 
      ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
      : new Date().toISOString();
  
    const formattedDate = new Date(observationDateTime).toLocaleString();
  
    let messages = [`Patient Care Area recorded on ${formattedDate}.\n`];
  
   
    if (observations.surgical?.value) {
      messages.push(`Surgical: ${observations.surgical.value}. `);
    }
    if (observations.MedicalBench?.value) {
      messages.push(`Medical Bench: ${observations.MedicalBench.value}. `);
    }
    if (observations.ShortStay?.value) {
      messages.push(`Short Stay: ${observations.ShortStay.value}. `);
    }
    if (observations.isoloation?.value) {
      messages.push(`Isolation: ${observations.isoloation.value}. `);
    }
    if (observations.trauma?.value) {
      messages.push(`Trauma: ${observations.trauma.value}. `);
    }
  

    setPatientManagementPlanMessage(messages.join(""));
  
  }, [pData]);



  useEffect(() => {
    if (!pData) return;

    const encounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PATIENT_CARE_AREA
    );

   // console.log("Tione za patient managment",encounter)

    if (!encounter?.obs) return;

    const careAreas = encounter.obs
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (careAreas.length === 0) return;

    const encounterDate = new Date(encounter.encounter_datetime).toLocaleString();

    let messages = [`Patient Care Area recorded on: ${encounterDate}:`];

    careAreas.forEach((area: string) => {
      messages.push(`• ${area}`);
    });

    setPatientManagementPlanMessage(prev => prev + '\n' + messages.join('\n'));;
  }, [pData]);




// useEffect(() => {
//     if (!pData) return;
  
//     const medicationHistoryEncounter = pData.find(
//       (d: any) => d.encounter_type.uuid === encounters.PRESCRIPTION
//     );

//     console.log("makhwala:",medicationHistoryEncounter)
  
//     if (!medicationHistoryEncounter?.obs) return;
  
//     const getObservation = (conceptName: string) => {
//       return medicationHistoryEncounter.obs.find((ob: Obs) =>
//         ob.names.some((n) => n.name === conceptName)
//       );
//     };
  
//     const observations = {
//       MedicationName: getObservation(concepts.MEDICATION),
//       Formulation: getObservation(concepts.MEDICATION_FORMULATION),
//       Frequency: getObservation(concepts.MEDICATION_FREQUENCY),
//       Duration: getObservation(concepts.MEDICATION_DURATION),
//     };
  
    
//     const allObservationDates = [
//       observations.MedicationName?.obs_datetime,
//       observations.Formulation?.obs_datetime,
//       observations.Frequency?.obs_datetime,
//       observations.Duration?.obs_datetime,
//       medicationHistoryEncounter.encounter_datetime
//     ].filter(Boolean);
  
    
//      const observationDateTime = allObservationDates.length > 0
//        ? new Date(Math.max(...allObservationDates.map(d => new Date(d).getTime()))).toISOString()
//       : new Date().toISOString();
  
//     const formattedDate = new Date(observationDateTime).toLocaleString();
  
//     let messages = [`Medication History recorded on ${formattedDate}.\n`];
  
   
//     if (observations.MedicationName?.value) {
//       messages.push(`Medication: ${observations.MedicationName.value}. `);
//     }
//     if (observations.Formulation?.value) {
//       messages.push(`Formulation: ${observations.Formulation.value}. `);
//     }
//     if (observations.Frequency?.value) {
//       messages.push(`Frequency: ${observations.Frequency.value}. `);
//     }
//     if (observations.Duration?.value) {
//       messages.push(`Duration: ${observations.Duration.value}. `);
//     }
  
    
//     setPatientManagementPlanMessage(messages.join(""));
  
//   }, [pData]);



  useEffect(() => {
    if (!pData) return;

    const prescriptionEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PRESCRIPTION
    );

    if (!prescriptionEncounter?.obs) return;

    const observations = prescriptionEncounter.obs
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (observations.length === 0) return;

    const formattedDate = new Date(prescriptionEncounter.encounter_datetime).toLocaleString();
    let messages = [`Medication recorded on ${formattedDate}`];

    observations.forEach((obs: any) => {
      messages.push(`•${obs}. `);
    });

    setPatientManagementPlanMessage(prev => prev + '\n' + messages.join('\n'));;
  }, [pData]);


  return patientManagementPlanMessage;
};



// return {
//     nonPharmacologicalMessage,
//     careAreaMessage,
//     medicationHistoryMessage,
//     combinedMessage: [
//       nonPharmacologicalMessage,
//       careAreaMessage,
//       medicationHistoryMessage
//     ].filter(Boolean).join("\n\n")
//   };