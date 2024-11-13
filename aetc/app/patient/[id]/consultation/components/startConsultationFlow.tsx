"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";

import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";

import DiagnosisForm from "./diagnosisForm";
import { Button } from "@mui/material";
import { MedicationsForm } from "./medication";
import { BedsideTestForm } from "./bedsideTestForm";
import { TestAccordion } from "./testAccordion";

export const StartConsultationFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBack } = useNavigation();

  const steps = [
    { id: 1, label: "Investigations" },
    { id: 12, label: "Diagnosis" },
    { id: 13, label: "Medication" },
  ];

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Consultation Plan"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <>
          <TestAccordion />
          <Button onClick={() => setActiveStep(1)}>Next</Button>
        </>
        <>
          <DiagnosisForm />
          <Button onClick={() => setActiveStep(2)}>Next</Button>
        </>
        <MedicationsForm onSkip={() => {}} onSubmit={() => {}} />
      </NewStepperContainer>
    </>
  );
};
