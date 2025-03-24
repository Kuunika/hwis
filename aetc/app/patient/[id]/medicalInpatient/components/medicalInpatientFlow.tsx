"use client";

import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { PastMedicalHistory, PresentingComplaints } from ".";

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
      label: "Past medical history",
      encounter: encounters.CIRCULATION_ASSESSMENT,
    },
  ];

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical In Patient"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <PresentingComplaints />
        <DrugList />
        <PastMedicalHistory />
      </NewStepperContainer>
    </>
  );
};
