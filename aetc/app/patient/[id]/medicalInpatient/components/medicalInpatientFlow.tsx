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
  PresentingComplaints,
} from ".";

import { useNavigation } from "@/hooks";
import { encounters } from "@/constants";
import { DrugList } from "./drugList";

export const MedicalInPatientFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBack } = useNavigation();

  const steps = [
    {
      id: 1,
      label: "Presenting Complaints",
      encounter: encounters.AIRWAY_ASSESSMENT,
    },
    {
      id: 11,
      label: "Drug History",
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
      encounter: encounters.DISABILITY_ASSESSMENT,
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

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical In Patient"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
        showSubmittedStatus
      >
        <PresentingComplaints />
        <DrugList />
        {/* <BreathingForm onSubmit={handleBreathingSubmit} /> */}
        <Circulation onSubmit={handleCirculationSubmit} />
        <Disability onSubmit={handleDisabilitySubmit} />
        <Exposure onSubmit={navigateBack} />
      </NewStepperContainer>
    </>
  );
};
