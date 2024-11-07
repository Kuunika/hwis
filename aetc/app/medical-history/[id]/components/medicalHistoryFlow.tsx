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

import { concepts, encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient, getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";

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
  value: string;
  obsDatetime: string;
};

const convertObservations = (input: InputObservation[]): OutputObservation[] => {
  return input.flatMap((observation) =>
      observation.value.map((complaint) => ({
          concept: observation.concept,
          value: `complaint: ${complaint.complaint}, duration: ${complaint.duration} ${complaint.duration_unit}`,
          obsDatetime: observation.obsDatetime,
      }))
  );
};

const transformAllergyData = (arr:any[]) => {
  // Set the observation date-time here (e.g., the current date-time)
  const obsDatetime = new Date().toISOString();

  // Check if `arr` is an array of objects
  if (Array.isArray(arr)) {
      return arr.map(item => ({
          // Rename `group` to `concept`
          concept: "b9c81a9e-8d80-11d8-abbb-0024217bb78e",
          // Keep `value` as is
          value: item.value,
          // Add `obsDatetime` key
          obsDatetime: obsDatetime
      }));
  } 
  // Check if `arr` is a single string
  else if (typeof arr === 'string') {
      return {
          concept: "b9b6d27a-8d80-11d8-abbb-0024217bb78e",
          value: arr,
          obsDatetime: obsDatetime
      };
  }
  // Return null or handle unexpected data types
  return null;
};

export const MedicalHistoryFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateBack } = useNavigation();
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);
  const dateTime = getDateTime();

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

    const myobs = convertObservations(getObservations(modifiedValues, dateTime));
    console.log(myobs);
    mutate({ encounterType: encounters.PRESENTING_COMPLAINTS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs:  myobs});
      
    setActiveStep(1);
  };

  const handleAllergiesSubmission = (values: any) => {
    
    const myobs = (getObservations(values, dateTime));
    const transformedAllergyDataArray = myobs.map(item => transformAllergyData(item.value));
    console.log(transformedAllergyDataArray);
    mutate({  encounterType: encounters.SOCIAL_HISTORY,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs: transformedAllergyDataArray.flat() }); 
    setActiveStep(2);
  };




  function handleMedicationsSubmission(values: any): void {
    const observations =  getObservations(values, dateTime);
    console.log(observations);
  }

  function handleConditionsSubmission(values: any): void {
    throw new Error("Function not implemented.");
  }

  function handleSurgeriesSubmission(values: any): void {
    throw new Error("Function not implemented.");
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