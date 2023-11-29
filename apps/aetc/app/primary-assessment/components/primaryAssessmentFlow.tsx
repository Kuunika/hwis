"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "shared-ui/src";
import { AirwayForm, Circulation, Disability, Exposure } from ".";

export const PrimaryAssessmentFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 1, label: "Airway Assessment" },
    { id: 2, label: "Circulation Assessment" },
    { id: 3, label: "Disability Assessment" },
    { id: 4, label: "Exposure Assessment" },
  ];

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Primary Assessment"
        steps={steps}
        active={activeStep}
      >
        <AirwayForm onSubmit={() => setActiveStep(1)} />
        <Circulation onSubmit={() => setActiveStep(2)} />
        <Disability onSubmit={() => setActiveStep(3)} />
        <Exposure onSubmit={() => setActiveStep(4)} />
      </NewStepperContainer>
    </>
  );
};
