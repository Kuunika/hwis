"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import {
  ComplaintsForm,
  SurgeriesForm,
  AllergiesForm
} from ".";

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";

export const MedicalHistoryFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();

  const steps = [
    { id: 1, label: "Presenting Complaints" },
    { id: 2, label: "Allergies" },
    { id: 3, label: "Surgeries" },
    { id: 11, label: "Medications" },
    { id: 2, label: "Prior conditions" },
    
  ];

  const handlePresentingComplaintsSubmission = (values: any) => {
    mutate({ encounter: encounters.AIRWAY_ASSESSMENT, obs: values });
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

  const handleSkip =()=>{
    switch(activeStep){
     case 0:
      setActiveStep(1);
      return;
     case 1:
        setActiveStep(2);
        return;
     case 2:
        setActiveStep(3);
        return;
     case 3:
        navigateBack();
        return;
     default:
        return;
    }
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
        <ComplaintsForm onSubmit={handlePresentingComplaintsSubmission} onSkip={handleSkip}/>
        <AllergiesForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip}/>
        <SurgeriesForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip}/>
        
      </NewStepperContainer >
    </>
  );
};
