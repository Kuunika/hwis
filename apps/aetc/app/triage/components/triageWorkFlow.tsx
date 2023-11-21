"use client";
import { useState } from "react";
import { StepperContainer } from "shared-ui/src";
import {
  AirwayAndBreathingForm,
  BloodCirculationForm,
  ConsciousnessForm,
  PersistentPainForm,
} from ".";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 1, label: "Airway/Breathing" },
    { id: 2, label: "Blood Circulation" },
    { id: 3, label: "Consciousness" },
    { id: 4, label: "Persistent Pain/Other Concerns" },
  ];
  return (
    <StepperContainer
      steps={steps}
      active={activeStep}
      containerSx={{ display: "block" }}
      sx={{ alignItems: "flex-start" }}
    >
      <AirwayAndBreathingForm onSubmit={() => setActiveStep(1)} />
      <BloodCirculationForm onSubmit={() => setActiveStep(2)} />
      <ConsciousnessForm onSubmit={() => setActiveStep(3)} />
      <PersistentPainForm onSubmit={() => setActiveStep(4)} />
    </StepperContainer>
  );
}
