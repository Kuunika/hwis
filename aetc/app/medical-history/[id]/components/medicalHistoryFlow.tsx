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

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient, getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";


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

  const handlePresentingComplaintsSubmission = (values: any) => {
   
    const modifiedValues = {
      ...values,
      "b9a9e1c8-8d80-11d8-abbb-0024217bb78e": values.complaints,
    };
    
    delete modifiedValues.complaints;
    console.log(modifiedValues, values);
    mutate({ encounterType: encounters.PRESENTING_COMPLAINTS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime, 
      obs: getObservations(modifiedValues, dateTime) });
      
    setActiveStep(1);
  };
  const handleSurgeriesSubmission = (values: any) => {
    mutate({ encounter: encounters.BREATHING_ASSESSMENT, obs: values });
    setActiveStep(2);
  };

  const handleCirculationSubmit = (values: any) => {
    mutate({ encounter: encounters.CIRCULATION_ASSESSMENT, obs: values });
    setActiveStep(3);
  };
  const handleDisabilitySubmit = (values: any) => {
    mutate({ encounter: encounters.DISABILITY_ASSESSMENT, obs: values });
    setActiveStep(4);
  };

  const handleSkip = () => {
    const nextStep = activeStep + 1;
  
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
    } else {
      navigateBack();
    }
  };

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
        <AllergiesForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        <MedicationsForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        <PriorConditionsForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        <SurgeriesForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        {patient?.gender === "Female" && (
          <ObstetricsForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        )}
        <AdmissionsForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip}/>
        <ReviewOfSystemsForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip}/>
        <FamilyHistoryForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />
        

      </NewStepperContainer>
    </>
  );
};