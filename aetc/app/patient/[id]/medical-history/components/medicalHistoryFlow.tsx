"use client";;
import React, { useState } from "react";
import { NewStepperContainer } from "@/components";
import {
  ComplaintsForm,
  SurgeriesForm,
  AllergiesForm,
  MedicationsForm,
  PriorConditionsForm,
  ObstetricsForm,
  FamilyHistoryForm,
  AdmissionsForm,
  ReviewOfSystemsForm
} from ".";

import { concepts, encounters, durationOptions } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient, getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { useFormLoading } from "@/hooks/formLoading";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";
import { CustomizedProgressBars } from "@/components/loader";



type Complaint = {
  complaint: string;
  duration: string;
  duration_unit: string;
};

type InputObservation = {
  concept: string;
  value: Complaint[];
  obsDatetime: string;
};

type OutputObservation = {
  concept: string;
  value: string | boolean;
};

interface OverlayWithMessageProps {
  open: boolean;
  message: string;
}



const convertObservations = (input: InputObservation[]): OutputObservation[] => {
  return input.flatMap((observation) =>
    observation.value.flatMap((complaint) => [
      {
        concept: complaint.complaint,
        value: true,
      },
      {
        concept: complaint.duration_unit === durationOptions[0]
          ? concepts.DURATION_OF_SYMPTOMS_DAYS
          : complaint.duration_unit === durationOptions[1]
          ? concepts.DURATION_OF_SYMPTOMS_WEEKS
          : complaint.duration_unit === durationOptions[2]
          ? concepts.DURATION_OF_SYMPTOMS_MONTHS
          : concepts.DURATION_OF_SYMPTOMS_YEARS,
        value: complaint.duration,
      }
    ])
  );
};

const symptomDurationUnits: Record<string, string>  ={
  [durationOptions[0].toString()]: concepts.DURATION_OF_SYMPTOMS_DAYS,
  [durationOptions[1].toString()]: concepts.DURATION_OF_SYMPTOMS_WEEKS,
  [durationOptions[2].toString()]: concepts.DURATION_OF_SYMPTOMS_MONTHS,
  [durationOptions[3].toString()]: concepts.DURATION_OF_SYMPTOMS_YEARS,
}




export const MedicalHistoryFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const { navigateBack } = useNavigation();
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);
  const dateTime = getDateTime();


  const {
    loading,
    setLoading,
    completed,
    setCompleted,
    message,
    setMessage,
    showForm,
    setShowForm,
    error,
    setError,
  } = useFormLoading();

  const {
    data: encounterResponse,
    mutateAsync: createEncounter,
    isPending: creatingEncounter,
    isSuccess: encounterCreated,
    isError: encounterError,
    error: errorMessage,
} = addEncounter();

  const { data: patientVisits, isSuccess } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  if (isLoading) {
    return <div>Loading patient data...</div>;

  }





  // Construct steps based on patient gender
  const steps = [
    { id: 1, label: "Presenting complaints" },
    { id: 2, label: "Allergies" },
    { id: 3, label: "Medications" },
    { id: 4, label: "Prior/Existing conditions" },
    { id: 5, label: "Surgeries" },
    ...(patient?.gender === "Female" ? [{ id: 6, label: "Gynaecology and Obstetrics" }] : []),
    { id: patient?.gender === "Female" ? 7 : 6, label: "Previous Admissions" },
    { id: patient?.gender === "Female" ? 8 : 7, label: "Review of Systems" },
    { id: patient?.gender === "Female" ? 9 : 8, label: "Family history" },
    
  ];


  const handleSkip = () => {
    const nextStep = activeStep + 1;
  
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
    } else {
      navigateBack();
    }
  };

  const handlePrevious = () =>{
    const previousStep = activeStep -1;
    setActiveStep(previousStep)
  }

  const handlePresentingComplaintsNext = (values: any)=>{
    setFormData((prev: any) => ({ ...prev, presentingComplaints: values }));
    handleSkip();
  }

  const handlePresentingComplaintsSubmission = async (values: any): Promise<any> => {
   
    const myobs = convertObservations(getObservations(values, dateTime));

    for (let i = 0; i < myobs.length; i += 2) {
      const chunk = myobs.slice(i, i + 2);
      
      try {
        
        const response = await createEncounter({
          encounterType: encounters.PRESENTING_COMPLAINTS,
          visit: activeVisit?.uuid,
          patient: params.id,
          encounterDatetime: dateTime,
          obs: [
            {
              concept: concepts.CURRENT_COMPLAINTS_OR_SYMPTOMS,
              value: true,
              obsDatetime: dateTime,
              group_members: chunk,
            },
          ],
        });
      
    
      } catch (error: any) {
        throw error;
      }
    }

  };

  const handleAllergiesNext = (values: any)=>{
    setFormData((prev: any) => ({ ...prev, allergies: values }));
    handleSkip();
  }

  const handleAllergiesSubmission = async (values: any): Promise<void> => {

  const groupedAllergies = values[concepts.ALLERGY].reduce((acc:any, allergy:any) => {
    if (!acc[allergy.group]) {
      acc[allergy.group] = [];
    }
    acc[allergy.group].push(allergy);
    return acc;
  }, {});
  
  const observationsPayload = Object.keys(groupedAllergies).map(groupKey => {
    const groupConcept = groupKey; 
    const chunk = groupedAllergies[groupKey].map((allergy: { value: any; label: string | string[]; }) => {
      let conceptValue = allergy.value; 
      let value = true; 
      if (allergy.label.includes("Other medical substance allergy")) {
        
        conceptValue = concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY; 
        value = values[concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY]; 
      } 
      
      if (allergy.label.includes("Other substance allergy")) {
        conceptValue = concepts.OTHER_SUBSTANCE_ALLERGY; 
        value = values[concepts.OTHER_SUBSTANCE_ALLERGY]; 
      }
      
      if (allergy.label.includes("Other medication allergy")) {
        conceptValue = concepts.OTHER_MEDICATION_ALLERGY; 
        value = values[concepts.OTHER_MEDICATION_ALLERGY]; 
      }

      if (allergy.label.includes("Other food allergy")) {
        conceptValue = concepts.OTHER_FOOD_ALLERGY; 
        value = values[concepts.OTHER_FOOD_ALLERGY]; 
      }
  
      return {
        concept: conceptValue, 
        value: value, 
      };
    });
  
    return {
      person: params.id,
      concept: groupConcept, 
      obsDatetime: dateTime,
      value: true,
      group_members: chunk, 
    };
  });
  
  observationsPayload.forEach(async (observation) => {
      observation.group_members.push({
        concept: concepts.ALLERGY_COMMENT,
        value: values[concepts.ALLERGY_COMMENT]
      });
  
      try {
        const response = await createEncounter({
        encounterType: encounters.ALLERGIES,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs: [{
          concept: observation.concept, 
          value: true,
          obsDatetime: dateTime,
          group_members: observation.group_members,
        },],            
    },);
    console.log("Encounter successfully created:", response);
  } catch (error: any) {
    throw error;
  }
  });


  };

  function handleMedicationsNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, medications: values }));
      handleSkip();
  }

  async function handleMedicationsSubmission(values: any): Promise<void> {
    const observations =  getObservations(values, dateTime);
    const medicationObs = observations[0]?.value || [];
    
    const durationUnits: Record<string, string>  ={
      [durationOptions[0].toString()]: concepts.DURATION_ON_MEDICATION_DAYS,
      [durationOptions[1].toString()]: concepts.DURATION_ON_MEDICATION_WEEKS,
      [durationOptions[2].toString()]: concepts.DURATION_ON_MEDICATION_MONTHS,
      [durationOptions[3].toString()]: concepts.DURATION_ON_MEDICATION_YEARS,
    }

    const doseUnits: Record<string, string>  ={
      "Milligrams (mg)": concepts.DOSE_IN_MILLIGRAMS,
      "Micrograms (µg)": concepts.DOSE_IN_MICROGRAMS,
     "Grams (g)": concepts.DOSE_IN_GRAMS,
     "International Units (IU)": concepts.DOSE_IN_IU,
     "Milliliters (ml)": concepts.DOSE_IN_MILLIMETER,
     "Millimoles (mmol)": concepts.DOSE_IN_MILLIMOLES,	
    }



    const observationsPayload = medicationObs.map((medication: any) => {
      const observation = {
        person: params.id,
        concept: medication.name, 
        obsDatetime: dateTime,
        value: true,
        group_members: [] as OutputObservation[], 
      };
    
     
        if (medication.medication_date_last_taken) {
          observation.group_members.push({
            concept: concepts.MEDICATION_DATE_LAST_TAKEN,
            value: medication.medication_date_last_taken,    
          } as OutputObservation);
        }

        if (medication.medication_date_of_last_prescription) {
          observation.group_members.push({
            concept: concepts.MEDICATION_DATE_OF_LAST_PRESCRIPTION,   
            value: medication.medication_date_of_last_prescription  
          } as OutputObservation);
        }

        if(medication.medication_frequency){
          observation.group_members.push({
            concept: medication.medication_frequency,   
            value: true     
          } as OutputObservation);
        }

        if(medication.medication_dose_unit){
          const unitconcept = doseUnits[medication.medication_dose_unit];
          observation.group_members.push({
            concept: unitconcept,   
            value: medication.medication_dose  
          } as OutputObservation);
        }

        
        if(medication.medication_duration_unit){
          const unitconcept = durationUnits[medication.medication_duration_unit];
          observation.group_members.push({
            concept: unitconcept,   
            value: medication.medication_duration    
          } as OutputObservation);
        }

        if(medication.formulation){
          observation.group_members.push({
            concept: medication.formulation,   
            value: true     
          } as OutputObservation);
        }
        
    
      return observation;
    });

    observationsPayload.forEach(async (observation: any) => {

      try {
        const response = await
        createEncounter({
        encounterType: encounters.PRESCRIPTIONS,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [observation, observation],
      })  
      console.log("Encounter successfully created:", response);
    } catch (error: any) {
      throw error;
    }
    
  });

  };


  function handleConditionsNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, conditions: values }));
    handleSkip();
  }

  async function handleConditionsSubmission(values: any): Promise<void> {
    const observationsPayload = values.conditions.map((condition: any) => {
    return  {
      concept: concepts.DIAGNOSIS_DATE,
      obsDatetime: dateTime,
      value: condition.date,
      group_members: [
  
        { concept: concepts.ICD11_DIAGNOSIS, value: condition.name },
        { concept: concepts.ON_TREATMENT, value: condition.onTreatment },
        { concept: concepts.ADDITIONAL_DIAGNOSIS_DETAILS, value: condition.additionalDetails },
      ] as OutputObservation[],
    }
  });

  observationsPayload.forEach(async (observation: any) => {
    try {
      const response = await createEncounter({
      encounterType: encounters.DIAGNOSIS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [observation],
    })  
    console.log("Encounter successfully created:", response);
  } catch (error: any) {
    throw error;
  }
  });


  }

  function handleSurgeriesNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, surgeries: values }));
    handleSkip();
  }

  async function handleSurgeriesSubmission(values: any): Promise<void> {
    const observationsPayload = values.surgeries.map((surgery: any) => {
    return  {
      concept: concepts.DATE_OF_SURGERY,
      obsDatetime: dateTime,
      value: surgery.date,
      group_members: [
        { concept: surgery.procedure === 'other_surgical_procedure'? concepts.SURGICAL_PROCEDURE : surgery.procedure, value: surgery.procedure === 'other_surgical_procedure'? surgery.other : true },
        { concept: concepts.INDICATION_FOR_SURGERY, value: surgery.indication },
        { concept: concepts.COMPLICATIONS, value: surgery.complication },
      ] as OutputObservation[],
    }
  });

  observationsPayload.forEach(async (observation: any) => {
    try {
      const response = await createEncounter({
      encounterType: encounters.SURGICAL_HISTORY,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [observation],
    })
    console.log("Encounter successfully created:", response);
  } catch (error: any) {
    throw error;
  }
  });

  }

  function handleObstetricsNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, obstetrics: values }));
    handleSkip();
  }



  async function handleObstetricsSubmission(values: any): Promise<void> {
    
    const obstetricsObs = values;
    const contraceptives = obstetricsObs.contraceptive_history.map((item: { id: any; }) => ({
      concept: item.id,
      value: true
    }));


    const myObs =  obstetricsObs.pregnant === "Yes"? [
      { concept: concepts.AGE_AT_MENARCHE, value: obstetricsObs.age_at_menarche},
      { concept: concepts.DATE_OF_LAST_MENSTRUAL, value: obstetricsObs.last_menstral},
      { concept: concepts.GESTATION_WEEKS, value: obstetricsObs.gestational_age },
      { concept: concepts.PREVIOUS_PREGNANCIES, value: obstetricsObs.number_of_previous_pregnancies },
    ] : [
      { concept: concepts.AGE_AT_MENARCHE, value: obstetricsObs.age_at_menarche},
      { concept: concepts.DATE_OF_LAST_MENSTRUAL, value: obstetricsObs.last_menstral},
      { concept: concepts.PREVIOUS_PREGNANCIES, value: obstetricsObs.number_of_previous_pregnancies },
    ]

   myObs.push(...contraceptives);

   try {
    const response =  await createEncounter({  encounterType: encounters.OBSTETRIC_HISTORY,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs: myObs });
      console.log("Encounter successfully created:", response);
    } catch (error: any) {
      throw error;
    }


    if(obstetricsObs.number_of_previous_pregnancies > 0){
    
    const outcomes = obstetricsObs.previous_pregnancy_outcomes;
    const births =  obstetricsObs.number_of_births;
    
    
    const observationsPayload = outcomes.map((outcome: any, index: any) => {
      if(outcome == concepts.LIVE_BIRTH){
      return  {
        person: params.id,
        concept: concepts.PREGENANCY_OUTCOME,
        obsDatetime: dateTime,
        value: true,
        group_members: [
          { concept: outcome, value: true },
          { concept: concepts.NUMBER_OF_BIRTHS, value: births[index] },
        ] as OutputObservation[],
      }
     }

      return  {
        person: params.id,
        concept: concepts.PREGENANCY_OUTCOME,
        obsDatetime: dateTime,
        value: true,
        group_members: [
          { concept: outcome, value: true },
        ] as OutputObservation[],
      }

    });
  
    observationsPayload.forEach(async (observation: any) => {
      try{
      const response = await createEncounter({
        encounterType: encounters.OBSTETRIC_HISTORY,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [observation]
      });
      console.log("Encounter successfully created:", response);
        } catch (error: any) {
          throw error;
    }
    });
  };

  }

  function handleAdmissionsNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, admissions: values }));
    handleSkip();
  }

  async function handleAdmissionsSubmission(values: any): Promise<void> {
    const admissions = values.admissions;
  
    if (!Array.isArray(admissions)) {
      console.error("Admissions data is invalid or not an array:", admissions);
      return;
    }

    const encounterPayload = admissions.map((admission: any) => ({
      encounterType: encounters.PATIENT_ADMISSIONS, 
      visit: activeVisit?.uuid, 
      patient: params.id, 
      encounterDatetime: dateTime,
      obs: [
        {
          concept: concepts.ADMISSION_DATE, 
          value: admission.date,
          obsDatetime: dateTime,
          group_members: [
            { concept: concepts.HEALTH_CENTER_HOSPITALS, value: admission.hospital }, 
            { concept: concepts.ADMISSION_SECTION, value: admission.ward },
            {concept: concepts.ICD11_DIAGNOSIS, value: admission.diagnosis},
            { concept: concepts.SURGICAL_INTERVENTIONS, value: admission.interventions },
            { concept: concepts.DISCHARGE_INSTRUCTIONS, value: admission.discharge_instructions },
            { concept: concepts.FOLLOW_UP, value: admission.follow_up_plans },
          ]as OutputObservation[],
        },
      ]
    }));

    encounterPayload.forEach(async (encounter, index) => {
      try {
        const response = await createEncounter(encounter);
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    });

  }
  
  function handleReviewNext(values: any): void {
      setFormData((prev: any) => ({ ...prev, review: values }));
      handleSkip();
  }
  
  async function handleReviewSubmission(values: any): Promise<void> {
    const lastMeal = values['lastMeal'];
    const historyOfComplaints = values['events'];

    const historyOfComplaintsObs = {
      concept:concepts.PRESENTING_HISTORY,
      value: historyOfComplaints
    };

    const lastMealObs = {
      concept:concepts.DATE_OF_LAST_MEAL,
      value: lastMeal
    };
    
    const initialObs = historyOfComplaints?[historyOfComplaintsObs,lastMealObs]:null;
 
    if(initialObs){

      try{
    createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs:  [{
        concept: initialObs?concepts.PRESENTING_HISTORY:concepts.DATE_OF_LAST_MEAL, 
        value: initialObs?true:lastMeal,
        obsDatetime: dateTime,
        group_members:initialObs?initialObs:null,
      },]});
    }catch(error: any){
        throw error;
    }
    };
    const symptom_uuid: Record<string, string>  ={
      "pain":concepts.PAIN, 
      "rash":concepts.RASH,  
      "itching":concepts.ITCHING,  
      "earDischarge":concepts.EAR_DISCHARGE,  
      "redEye":concepts.RED_EYE,  
      "dizziness":concepts.DIZZINESS,  
      "excessiveThirst":concepts.EXCESSIVE_THIRST, 
      "painfulEar":concepts.PAINFUL_EAR,  
      "poorVision":concepts.POOR_VISION,  
      "toothache":concepts.TOOTHACHE, 
      "runnyNose":concepts.RUNNY_NOSE,  
      "noseBleeding":concepts.NOSE_BLEED, 
      "jointSwelling":concepts.SWOLLEN_JOINT, 
      "jointPain":concepts.JOINT_PAIN, 
      "deformity":concepts.DEFORMITY, 
      "fever":concepts.FEVER, 
      "nightSweats":concepts.NIGHT_SWEATS, 
      "weightLoss":concepts.WEIGHT_LOSS, 
      "heatIntolerance":concepts.HEAT_INTOLERANCE, 
      "coldIntolerance":concepts.COLD_INTOLERANCE, 
      "bodySwelling":concepts.SWELLING, 
      "fatigue":concepts.FATIGUE, 
      "poisoning":concepts.POISONING, 
      "poisoningIntentional":concepts.INTENTIONAL_POISONING, 
      "ulcerWound":concepts.ULCER_OR_WOUND 
    };

    const symptomKeys = Object.keys(symptom_uuid);

    const gastroHistory = values["Gastrointenstinal_history"];
    const cardiacHistory = values['Cardiac/Respiratory history'];
    const nervousHistory = values['Nervous system history'];
    const genitoHistory = values['genitourinaryHistory'];

    if(gastroHistory){
     const gastroObs =  gastroHistory.map((obs: any) => {
        return{
          concept: obs.id,
          value: true
        }
      });

      try{
      const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs:  [{
          concept: concepts.GASTROINTESTINAL, 
          value: true,
          obsDatetime: dateTime,
          group_members: gastroObs,
        },]});
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    };

    if(cardiacHistory){
      const cardiacObs =  cardiacHistory.map((obs: any) => {
        return{
          concept: obs.id,
          value: true
        }
      });

      try{
        const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs:  [{
          concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
          value: true,
          obsDatetime: dateTime,
          group_members: cardiacObs,
        },]});
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    };

    if(nervousHistory){
      const nervousObs =  nervousHistory.map((obs: any) => {
        return{
          concept: obs.id,
          value: true
        }
      });

      try{
        const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs:  [{
          concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
          value: true,
          obsDatetime: dateTime,
          group_members: nervousObs,
        },]});
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    }

    if(genitoHistory){
      const otherConditons = values['Other_Genitourinary_condition']
      const genitoObs =  genitoHistory.map((obs: any) => {
        return{
          concept: obs.id,
          value: true
        }
      });
      
      if(otherConditons)
      {
        genitoObs.push({
          concept: concepts.OTHER_GENITOURINARY_CONDITION,
          value: otherConditons
        })
      };

      
      try{
        const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs:  [{
          concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
          value: true,
          obsDatetime: dateTime,
          group_members: genitoObs,
        },]});
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    }
    
    for(let key of symptomKeys){
    const durationUnit = values[`${key}DurationUnit`];
    const duration = values[`${key}Duration`];
    const site = values[`${key}_site`];
    
    if (durationUnit) {

    const symptomConcept={
        concept: symptom_uuid[key],
        value: true,
      }

    const symptomDurationConcept = {
      concept: symptomDurationUnits[durationUnit],
      value: duration,
    };

    const symptomSiteConcept = {
      concept: concepts.ANATOMIC_LOCATIONS,
      value: site,
    };

    const obsGroup = site ? [symptomConcept, symptomDurationConcept, symptomSiteConcept] : [symptomConcept, symptomDurationConcept];

    if(key == 'poisoning')
    {
      const intentionalPoisoningObs = {
        concept: concepts.INTENTIONAL_POISONING,
        value: values['poisoningIntentional']
      }
      
      obsGroup.push(intentionalPoisoningObs)
    }
    try{
      const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
          visit: activeVisit?.uuid,
          patient: params.id,
          encounterDatetime: dateTime, 
          obs:  [{
            concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
            value: true,
            obsDatetime: dateTime,
            group_members: obsGroup,
          },]});
          console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
      }


    }

    

    if(values['wasInjured']==="Yes"){

      type InjuryMechanismList = {
        [key: string]: string;
      };
      const injuryMechanismList: InjuryMechanismList = {
        assault: concepts.ASSAULT,
        roadTraffic: concepts.ROAD_TRAFFIC_ACCIDENT,
        fall: concepts.FALL,
        bite: concepts.BITE,
        gunshot: concepts.GUNSHOT,
        collapse: concepts.FAINTING_SYNCOPE_COLLAPSE,
        selfInflicted: concepts.SELF_HARM,
        burns: concepts.BURN_INJURY,
        drowning: concepts.DROWNING,
      };

      const mechanism = Object.keys(injuryMechanismList).filter((key) => values['injuryMechanism'] === key);
      const commentKey = `${values['injuryMechanism']}Comment`
      const injuryComment= values[commentKey];

      const timeOfInjury = (values['timeOfInjury'].$d).toLocaleString()

      const traumaObs = [{
        concept: injuryMechanismList[mechanism[0]],
        value: injuryComment
      }]

      const timeOfInjuryObs = {
        concept: concepts.TIME_OF_INJURY,
        value: timeOfInjury
      }

      const consciousnessObs = {
        concept: concepts.LOSS_OF_CONSCIOUSNESS,
        value: values['lostConsciousness']
      }

      const occupationalObs = {
        concept: concepts.OCCUPATIONAL_INJURY,
        value: values['occupationalInjury']
      }

      traumaObs.push(timeOfInjuryObs,consciousnessObs,occupationalObs)

      if(values['assaultType']){
        traumaObs[0].concept = injuryMechanismList['assault']
        const assaultType = values['assaultType'];
        const assaultTypeObs = {
          concept: assaultType == 'Sexual'?concepts.SEXUAL_ASSAULT:concepts.PHYSICAL_ASSAULT,
          value: true
        }
        traumaObs.push(assaultTypeObs)
      }

      try{
        const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs:  [{
          concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
          value: true,
          obsDatetime: dateTime,
          group_members: traumaObs,
        },]});
        console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }

    }

    const occuption = values['occupation'];
    const socialDetails = values['socialDetails'];
    const marital = values['maritalStatus'];
    const travelDetails = values['travelDetails'];
    if(socialDetails){
    const occupationObs = {
      concept: concepts.OCCUPATION,
      value: occuption
    };

    const socialDetailsObs = [
      {
      concept: concepts.PATIENT_SMOKES,
      value: socialDetails?.[0]?.value
    },{
      concept: concepts.PATIENT_DRINKS_ALCOHOL,
      value: socialDetails?.[1]?.value
    }
  ] ;
      
    const maritalObs = {
      concept: concepts.MARITAL_STATUS,
      value: marital
    };

    const travelObs = {
      concept:concepts.TRAVEL_HISTORY,
      value: travelDetails
    }

    socialDetailsObs.push(occupationObs,maritalObs,travelObs)
    
    try{
      const response = await createEncounter({ encounterType: encounters.SUMMARY_ASSESSMENT,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs:  [{
        concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
        value: true,
        obsDatetime: dateTime,
        group_members: socialDetailsObs,
      },]});
      console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error
      }
    }

  };



  function handleFamilyNext(values: any): void {
    setFormData((prev: any) => ({ ...prev, family: values }));
    handleSubmitAll(0);
}

async function handleSubmitAll(index: number){
  setLoading(true);

  if(index > Object.keys(formData).length-1) {
    setLoading(false);
    handleSkip();
    return;
  }

  const submissionHandlers: Record<string, (value: any) => Promise<void>> = {
    presentingComplaints: handlePresentingComplaintsSubmission,
    allergies: handleAllergiesSubmission,
    medications: handleMedicationsSubmission,
    conditions: handleConditionsSubmission,
    surgeries: handleSurgeriesSubmission,
    obstetrics: handleObstetricsSubmission,
    admissions: handleAdmissionsSubmission,
    review: handleReviewSubmission,
    family: handleFamilyHistorySubmission,
  };


 const key = Object.keys(formData)[index];
 const encounter = formData[key];


 try {
  await submissionHandlers[key](encounter);
  
  setTimeout(()=>{
    setMessage(`${key} submitted`)
    handleSubmitAll(index+1)
    setCompleted(index+1);
  },2000)

 } catch (error) {
  console.log({error})
  setError(true);
  setMessage(`error occurred when submitting ${key}`)
  
  
 }


}



  async function handleFamilyHistorySubmission(values: any): Promise<void> {
    const conditionConcepts: { [key: string]: string }  = {
      asthma: concepts.FAMILY_HISTORY_ASTHMA,
      hypertension: concepts.FAMILY_HISTORY_HYPERTENSION,
      diabetes_mellitus: concepts.FAMILY_HISTORY_DIABETES_MELLITUS,
      epilepsy: concepts.FAMILY_HISTORY_EPILEPSY,
      cancer: concepts.FAMILY_HISTORY_CANCER,
      tuberculosis: concepts.FAMILY_HISTORY_TUBERCULOSIS,
      other: concepts.FAMILY_HISTORY_OTHER_CONDITION,
    }

    const observations: { concept: string; value: any; }[] = [];
  
    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (key.includes("Relationship")) {
        const conditionKey = key.replace("Relationship", ""); 
        const relationship = value;
  
        if (values[conditionKey + "Type"]) {
          const conditionType = values[conditionKey + "Type"];  
  

          observations.push({
            concept: conditionConcepts[conditionKey],  
            value: conditionType,   
          });
        } else if (key === "otherRelationship" && values["otherSpecify"]) {

          observations.push({
            concept: conditionConcepts["other"],  
            value: values["otherSpecify"],  
          });
        } else {

          observations.push({
            concept: conditionConcepts[conditionKey], 
            value: true, 
          });
        }
  

        observations.push({
          concept: concepts.RELATIONSHIP_TO_PATIENT, 
          value: relationship,  
        });
      }
 
      if (key.includes("Type") && !values[key.replace("Type", "Relationship")]) {
        const conditionKey = key.replace("Type", "");  
        const conditionType = value;
  
        observations.push({
          concept: conditionConcepts[conditionKey],  
          value: conditionType,   
        });
      }
    });
  

    const groupedObservations = [];
    for (let i = 0; i < observations.length; i += 2) {
      groupedObservations.push([observations[i], observations[i + 1]]);
    };

    groupedObservations.forEach(async (group, index) => {
      try{
      const response = await createEncounter({
        encounterType: encounters.FAMILY_MEDICAL_HISTORY, 
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [
          {
            concept: concepts.REVIEW_OF_SYSTEMS_OTHER, 
            value: true,
            obsDatetime: dateTime,
            group_members: group,  
          },
        ],
      });
      console.log("Encounter successfully created:", response);
      } catch (error: any) {
        throw error;
      }
    });


  }



  return (
    <>

     { (loading) && 
     <>
     <CustomizedProgressBars
                message={message}
                progress={(completed / Object.keys(formData).length) * 100}
              />
              </>}

 
  
    {  !loading &&<NewStepperContainer
        setActive={setActiveStep}
        title="Medical History"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <ComplaintsForm onSubmit={handlePresentingComplaintsNext} />
        <AllergiesForm onSubmit={handleAllergiesNext} onSkip={handlePrevious} />
        <MedicationsForm onSubmit={handleMedicationsNext} onSkip={handlePrevious} />
        <PriorConditionsForm onSubmit={handleConditionsNext} onSkip={handlePrevious} />
        <SurgeriesForm onSubmit={handleSurgeriesNext} onSkip={handlePrevious} />
        {patient?.gender === "Female" && (
          <ObstetricsForm onSubmit={handleObstetricsNext} onSkip={handlePrevious} />
        )}
        <AdmissionsForm onSubmit={handleAdmissionsNext} onSkip={handlePrevious}/>
        <ReviewOfSystemsForm onSubmit={handleReviewNext} onSkip={handlePrevious}/>
        <FamilyHistoryForm onSubmit={handleFamilyNext} onSkip={handlePrevious} />
    
      </NewStepperContainer>  }
    </>
  );
};






