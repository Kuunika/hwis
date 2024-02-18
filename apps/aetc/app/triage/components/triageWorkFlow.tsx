"use client";
import { useState } from "react";
import { NewStepperContainer, StepperContainer } from "shared-ui/src";
import {
  AirwayAndBreathingForm,
  BloodCirculationForm,
  ConsciousnessForm,
  PersistentPainForm,
  PresentingComplaintsForm,
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
    { id: 6, label: "Presenting Complaints" },
    { id: 5, label: "Vitals Signs" },
    { id: 1, label: "Airway/Breathing" },
    { id: 2, label: "Blood Circulation" },
    { id: 3, label: "Disability" },
    { id: 4, label: "Persistent Pain/Other Concerns" },
  ];

  const handlePersistentPain = (values: any) => {
    mutate({ encounter: encounters.VITALS, obs: values });
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
    setActiveStep(2);
  };

  const handleAirwaySubmit = (values: any) => {
    mutate({ encounter: encounters.AIRWAY_BREATHING, obs: values });
    setActiveStep(3);
  };
  const handleBloodCirculationSubmit = (values: any) => {
    mutate({ encounter: encounters.BLOOD_CIRCULATION, obs: values });
    setActiveStep(4);
  };
  const handleConsciousnessSubmit = (values: any) => {
    mutate({ encounter: encounters.CONSCIOUSNESS, obs: values });
    setActiveStep(5);
  };

  const handlePresentComplaints = (values: any) => {
    setActiveStep(1);
  };
  return (
    <NewStepperContainer
      setActive={(value) => {
        setActiveStep(value);
      }}
      title="Triage"
      steps={steps}
      active={activeStep}
      onBack={() => navigateTo("/patient")}
    >
      <PresentingComplaintsForm onSubmit={handlePresentComplaints} />
      <VitalsForm initialValues={{}} onSubmit={handleVitalsSubmit} />
      <AirwayAndBreathingForm onSubmit={handleAirwaySubmit} />
      <BloodCirculationForm onSubmit={handleBloodCirculationSubmit} />
      <ConsciousnessForm onSubmit={handleConsciousnessSubmit} />
      <PersistentPainForm onSubmit={handlePersistentPain} />
    </NewStepperContainer>
  );
}
