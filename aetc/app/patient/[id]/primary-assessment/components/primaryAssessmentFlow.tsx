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

import { useNavigation, useParameters } from "@/hooks";
import { encounters } from "@/constants";

export const PrimaryAssessmentFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBackToProfile, navigateTo } = useNavigation();
  const { params } = useParameters();

  const steps = [
    {
      id: 1,
      label: "Airway Assessment",
      encounter: encounters.AIRWAY_ASSESSMENT,
    },
    {
      id: 11,
      label: "Breathing Assessment",
      encounter: encounters.BREATHING_ASSESSMENT,
    },
    {
      id: 2,
      label: "Circulation Assessment",
      encounter: encounters.CIRCULATION_ASSESSMENT,
    },
    {
      id: 3,
      label: "Disability Assessment",
      encounter: encounters.PRIMARY_DISABILITY_ASSESSMENT,
    },
    {
      id: 4,
      label: "Exposure Assessment",
      encounter: encounters.EXPOSURE_ASSESSMENT,
    },
  ];

  const handleAirwaySubmit = () => {
    setActiveStep(1);
  };
  const handleBreathingSubmit = () => {
    setActiveStep(2);
  };

  const handleCirculationSubmit = () => {
    setActiveStep(3);
  };
  const handleDisabilitySubmit = () => {
    setActiveStep(4);
  };
  const redirectToSampleHistory = () => {
    navigateTo(`/patient/${params.id}/medicalHistory`);
  };
  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Primary Assessment"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBackToProfile()}
        showSubmittedStatus
      >
        <AirwayForm onSubmit={handleAirwaySubmit} />
        <BreathingForm onSubmit={handleBreathingSubmit} />
        <Circulation onSubmit={handleCirculationSubmit} />
        <Disability onSubmit={handleDisabilitySubmit} />
        <Exposure onSubmit={redirectToSampleHistory} />
      </NewStepperContainer>
    </>
  );
};
