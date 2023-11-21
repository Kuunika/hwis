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
    { id: 1, label: "Vitals" },
    { id: 2, label: "Airway/Breathing" },
    { id: 3, label: "Blood Circulation" },
    { id: 4, label: "Consciousness" },
    { id: 5, label: "Persistent Pain/Other Concerns" },
  ];
  return (
    <StepperContainer steps={steps} active={activeStep}>
      <AirwayAndBreathingForm onSubmit={() => setActiveStep(2)} />
      <BloodCirculationForm onSubmit={() => setActiveStep(3)} />
      <ConsciousnessForm onSubmit={() => setActiveStep(4)} />
      <PersistentPainForm onSubmit={() => setActiveStep(5)} />
    </StepperContainer>
  );
}
