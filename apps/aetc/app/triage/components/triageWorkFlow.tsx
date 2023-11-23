"use client";
import { useState } from "react";
import { NewStepperContainer, StepperContainer } from "shared-ui/src";
import {
  AirwayAndBreathingForm,
  BloodCirculationForm,
  ConsciousnessForm,
  PersistentPainForm,
} from ".";
import { VitalsForm } from "@/app/vitals/components/vitalsForm";
import { useNavigation } from "@/hooks";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateTo } = useNavigation();
  const steps = [
    { id: 5, label: "Vitals" },
    { id: 1, label: "Airway/Breathing" },
    { id: 2, label: "Blood Circulation" },
    { id: 3, label: "Consciousness" },
    { id: 4, label: "Persistent Pain/Other Concerns" },
  ];

  const handlePersistentPain = () => {
    navigateTo("/assessments");
  };
  return (
    <NewStepperContainer title="Triage" steps={steps} active={activeStep}>
      <VitalsForm initialValues={{}} onSubmit={() => setActiveStep(1)} />
      <AirwayAndBreathingForm onSubmit={() => setActiveStep(2)} />
      <BloodCirculationForm onSubmit={() => setActiveStep(3)} />
      <ConsciousnessForm onSubmit={() => setActiveStep(4)} />
      <PersistentPainForm onSubmit={handlePersistentPain} />
    </NewStepperContainer>
  );
}
