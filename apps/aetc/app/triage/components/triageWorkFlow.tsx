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
import { addObservation } from "@/hooks/observation";
import { encounters } from "@/constants";
import { successDialog } from "@/helpers";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addObservation();
  const { navigateTo } = useNavigation();
  const steps = [
    { id: 5, label: "Vitals" },
    { id: 1, label: "Airway/Breathing" },
    { id: 2, label: "Blood Circulation" },
    { id: 3, label: "Consciousness" },
    { id: 4, label: "Persistent Pain/Other Concerns" },
  ];

  const handlePersistentPain = () => {
    successDialog({
      title: "Triage Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/triage"),
      confirmButtonText: "Triage More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
    // navigateTo("/assessments");
  };

  const handleVitalsSubmit = (values: any) => {
    mutate({ encounter: encounters.VITALS, obs: values });
    setActiveStep(1);
  };

  const handleAirwaySubmit = (values: any) => {
    setActiveStep(2);
  };
  return (
    <NewStepperContainer
      setActive={(value) => {
        setActiveStep(value);
      }}
      title="Triage"
      steps={steps}
      active={activeStep}
    >
      <VitalsForm initialValues={{}} onSubmit={handleVitalsSubmit} />
      <AirwayAndBreathingForm onSubmit={handleAirwaySubmit} />
      <BloodCirculationForm onSubmit={() => setActiveStep(3)} />
      <ConsciousnessForm onSubmit={() => setActiveStep(4)} />
      <PersistentPainForm onSubmit={handlePersistentPain} />
    </NewStepperContainer>
  );
}
