"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import {
  AirwayForm,
  BreathingForm,
  Circulation,
  Disability,
  Exposure,
} from ".";

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";

export const PrimaryAssessmentFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();

  const steps = [
    { id: 1, label: "Airway Assessment" },
    { id: 11, label: "Breathing Assessment" },
    { id: 2, label: "Circulation Assessment" },
    { id: 3, label: "Disability Assessment" },
    { id: 4, label: "Exposure Assessment" },
  ];

  const handleAirwaySubmit = () => {
    // mutate({ encounter: encounters.AIRWAY_ASSESSMENT, obs: values });
    setActiveStep(1);
  };
  const handleBreathingSubmit = () => {
    // mutate({ encounter: encounters.BREATHING_ASSESSMENT, obs: values });
    setActiveStep(2);
  };

  const handleCirculationSubmit = () => {
    setActiveStep(3);
  };
  const handleDisabilitySubmit = (values: any) => {
    mutate({ encounter: encounters.DISABILITY_ASSESSMENT, obs: values });
    setActiveStep(4);
  };

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Primary Assessment"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <AirwayForm onSubmit={handleAirwaySubmit} />
        <BreathingForm onSubmit={handleBreathingSubmit} />
        <Circulation onSubmit={handleCirculationSubmit} />
        <Disability onSubmit={handleDisabilitySubmit} />
        <Exposure onSubmit={() => setActiveStep(5)} />
      </NewStepperContainer>
    </>
  );
};
