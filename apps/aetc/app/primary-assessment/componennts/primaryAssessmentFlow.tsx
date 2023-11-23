"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "shared-ui/src";
import { Circulation, Disability, Exposure } from ".";

export const PrimaryAssessmentFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 1, label: "Circulation Assessment" },
    { id: 2, label: "Disability Assessment" },
    { id: 3, label: "Exposure Assessment" },
  ];
  return (
    <>
      <NewStepperContainer
        title="Primary Assessment"
        steps={steps}
        active={activeStep}
      >
        <Circulation onSubmit={() => setActiveStep(1)} />
        <Disability onSubmit={() => setActiveStep(2)} />
        <Exposure onSubmit={() => setActiveStep(3)} />
      </NewStepperContainer>
    </>
  );
};
