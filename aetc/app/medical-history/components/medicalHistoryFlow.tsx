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
} from ".";

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";

export const MedicalHistoryFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateBack } = useNavigation();
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);

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
    { id: patient?.gender === "Female" ? 7 : 6, label: "Family history" },
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
        <FamilyHistoryForm onSubmit={handleSurgeriesSubmission} onSkip={handleSkip} />

      </NewStepperContainer>
    </>
  );
};