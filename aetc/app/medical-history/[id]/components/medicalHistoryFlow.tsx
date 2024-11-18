"use client";
import React, { useEffect, useState } from "react";
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
import { addObsChildren } from "@/hooks/obs";
import { useMutation } from "@tanstack/react-query";
import { isErrored } from "stream";
import { Encounter } from "@/interfaces";
import { boolean } from "yup";

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



const convertObservations = (input: InputObservation[]): OutputObservation[] => {

  console.log(input)
  return input.flatMap((observation) =>
    observation.value.flatMap((complaint) => [
      {
        concept: concepts.COMPLAINTS,
        value: complaint.complaint,
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



export const MedicalHistoryFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateBack } = useNavigation();
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);
  const dateTime = getDateTime();
  const {
    mutate: createObsChildren,
    isSuccess: obsChildrenCreated,
    isPending: creatingObsChildren,
    isError: obsChildrenError, 
  } = addObsChildren();
  const { data: patientVisits, isSuccess } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));
  // Wait for patient data to load
  if (isLoading) {
    return <div>Loading patient data...</div>; // Loading state or spinner
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

  const handlePresentingComplaintsSubmission = (values: any) => {
   
    const modifiedValues = {
      ...values,
      [concepts.COMPLAINTS] : values.complaints,
    };
    
    delete modifiedValues.complaints;

    const myobs = convertObservations(getObservations(values, dateTime));
    mutate({ encounterType: encounters.PRESENTING_COMPLAINTS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs:  []}, {
      onSuccess: (data) => {
          console.log("Encounter submitted successfully:", data);
          submitChildren(data, myobs);
          
        },
        onError: (error) => {
          console.error("Error submitting encounter:", error);
        },
      });
      
  };

  function submitChildren(data: any, myobs: any) {
  for (let i = 0; i < myobs.length; i += 2) {
    const chunk = myobs.slice(i, i + 2);


    const observationsPayload = {
      encounter: data.uuid,
      person: params.id,
      concept: concepts.CURRENT_COMPLAINTS_OR_SYMPTOMS,
      obsDatetime: dateTime,
      value: true,
      group_members: chunk, 
    };

 
    createObsChildren(observationsPayload);
    setActiveStep(1); 
  }
  };

  const handleAllergiesSubmission = (values: any) => {
    mutate({
        encounterType: encounters.ALLERGIES,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime, 
        obs: [],            
    }, {
      onSuccess: (data) => {
        console.log("Allergy encounter submitted successfully:", data);
        submitChildAllergies(data, values);
        
      },
      onError: (error) => {
        console.error("Error submitting medications:", error);
      },
    });

};

function submitChildAllergies(data: any, myobs: any) {


  const groupedAllergies = myobs[concepts.ALLERGY].reduce((acc:any, allergy:any) => {
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
        value = allergy.value; 
      } 
      
      if (allergy.label.includes("Other substance allergy")) {
        conceptValue = concepts.OTHER_SUBSTANCE_ALLERGY; 
        value = allergy.value; 
      }
      
      if (allergy.label.includes("Other medication allergy")) {
        conceptValue = concepts.OTHER_MEDICATION_ALLERGY; 
        value = allergy.value; 
      }

      if (allergy.label.includes("Other food allergy")) {
        conceptValue = concepts.OTHER_FOOD_ALLERGY; 
        value = allergy.value; 
      }
  
      return {
        concept: conceptValue, 
        value: value, 
      };
    });
  
    return {
      encounter: data.uuid,
      person: params.id,
      concept: groupConcept, 
      obsDatetime: dateTime,
      value: true,
      group_members: chunk, 
    };
  });
  
  observationsPayload.forEach((observation) => {
      observation.group_members.push({
        concept: concepts.ALLERGY_COMMENT,
        value: myobs[concepts.ALLERGY_COMMENT]
      });
  
    createObsChildren(observation);
  });

  if(obsChildrenCreated)
  setActiveStep(2);

  };



  function handleMedicationsSubmission(values: any): void {
    const observations =  getObservations(values, dateTime);

      mutate({
        encounterType: encounters.PRESCRIPTIONS,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [],
      }, {
        onSuccess: (data) => {
          console.log("Medications submitted successfully:", data);
          submitMedicationObservations(data, observations[0].value);
        },
        onError: (error) => {
          console.error("Error submitting medications:", error);
        },
      });
      
  }

  function submitMedicationObservations(data: Encounter, value: any) {
    const conceptMap: { 
      name: string;
      formulation: string;
      medication_dose: string;
      medication_dose_unit: string;
      medication_frequency: string;
      medication_route: string;
      medication_duration: string;
      medication_duration_unit: string;
      medication_date_last_taken: string;
      medication_date_of_last_prescription: string;
    } = {
      name: '',
      formulation: 'concept_uuid_for_formulation',
      medication_dose: 'concept_uuid_for_dose',
      medication_dose_unit: 'concept_uuid_for_dose_unit',
      medication_frequency: 'concept_uuid_for_frequency',
      medication_route: 'concept_uuid_for_route',
      medication_duration: 'concept_uuid_for_duration',
      medication_duration_unit: 'concept_uuid_for_duration_unit',
      medication_date_last_taken: 'concept_uuid_for_date_last_taken',
      medication_date_of_last_prescription: 'concept_uuid_for_date_of_last_prescription'
    };
    

    const observationsPayload = value.map((medication: any) => {
      const observation = {
        encounter: data.uuid,
        person: params.id,
        concept: medication.name, 
        obsDatetime: dateTime,
        value: true,
        group_members: [] as OutputObservation[], 
      };
    
      (Object.keys(medication) as Array<keyof typeof conceptMap>).forEach((key) => {
        if (key !== 'name' && conceptMap[key] && key !=='medication_frequency') {
          observation.group_members.push({
            concept: conceptMap[key],   
            value: medication[key]     
          } as OutputObservation);
        }

        if(key == 'medication_frequency' ){
          observation.group_members.push({
            concept: medication[key],   
            value: true     
          } as OutputObservation);
        }
      });
    
      return observation;
    });

    observationsPayload.forEach((observation: any) => {
  
    createObsChildren(observation);
  });

  if(obsChildrenCreated)
  setActiveStep(3);
  }

  function handleConditionsSubmission(values: any): void {
    mutate({
      encounterType: encounters.DIAGNOSIS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [],
    }, {
      onSuccess: (data) => {
        console.log("Diagnosis encounter submitted successfully:", data);
        submitDiagnosisObservations(data, values);
      },
      onError: (error) => {
        console.error("Error submitting Diagnosis encounter:", error);
      },
    });
  }

  function submitDiagnosisObservations(data: Encounter, values: any) {
    const observationsPayload = values.conditions.map((condition: any) => {
    return  {
      encounter: data.uuid,
      person: params.id,
      concept: condition.name, // Setting `name` as the main concept for this observation
      obsDatetime: dateTime,
      value: true,
      group_members: [
        { concept: concepts.DIAGNOSIS_DATE, value: condition.date },
        { concept: concepts.ON_TREATMENT, value: condition.onTreatment },
        { concept: concepts.ADDITIONAL_DIAGNOSIS_DETAILS, value: condition.additionalDetails },
      ] as OutputObservation[],
    }
  });

  observationsPayload.forEach((observation: any) => {
    createObsChildren(observation)
  });

  }

  function handleSurgeriesSubmission(values: any): void {
    mutate({
      encounterType: 'ba063e50-8d80-11d8-abbb-0024217bb78e',//encounters.SURGICAL_HISTORY,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [],
    }, {
      onSuccess: (data) => {
        console.log("Surgical encounter submitted successfully:", data);
        submitSurgicalObservations(data, values);
      },
      onError: (error) => {
        console.error("Error submitting surgical encounter:", error);
      },
    });
  }

  function submitSurgicalObservations(data: Encounter, values: any) {
    const observationsPayload = values.surgeries.map((surgery: any) => {
    return  {
      encounter: data.uuid,
      person: params.id,
      concept: surgery.procedure,
      obsDatetime: dateTime,
      value: surgery.other,
      group_members: [
        { concept: concepts.DATE_OF_SURGERY, value: surgery.date },
        { concept: surgery.indication, value: true },
        { concept: concepts.COMPLICATIONS, value: surgery.complication },
      ] as OutputObservation[],
    }
  });

  observationsPayload.forEach((observation: any) => {
    createObsChildren(observation)
  });

  }

  function handleObstetricsSubmission(values: any): void {
    console.log(values.obstetrics);
    mutate({  encounterType: encounters.OBSTETRIC_HISTORY,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs: getObservations(values.obstetrics, dateTime) }); 
      
    setActiveStep(7);
  }

  function handleAdmissionsSubmission(values: any): void {
    throw new Error("Function not implemented.");
  }

  function handleReviewSubmission(values: any): void {
    throw new Error("Function not implemented.");
  }

  function handleFamilyHistorySubmission(values: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical History"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <ComplaintsForm onSubmit={handlePresentingComplaintsSubmission} onSkip={handleSkip} />
        <AllergiesForm onSubmit={handleAllergiesSubmission} onSkip={handleSkip} />
        <MedicationsForm onSubmit={handleMedicationsSubmission} onSkip={handleSkip} />
        <PriorConditionsForm onSubmit={handleConditionsSubmission} onSkip={handleSkip} />
        <SurgeriesForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        {patient?.gender === "Female" && (
          <ObstetricsForm onSubmit={handleObstetricsSubmission} onSkip={handleSkip} />
        )}
        <AdmissionsForm onSubmit={handleAdmissionsSubmission} onSkip={handleSkip}/>
        <ReviewOfSystemsForm onSubmit={handleReviewSubmission} onSkip={handleSkip}/>
        <FamilyHistoryForm onSubmit={handleFamilyHistorySubmission} onSkip={handleSkip} />
        

      </NewStepperContainer>
    </>
  );
};






