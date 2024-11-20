"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";
import { LabRequestForm } from "./labRequestForm";
import { LabRequest } from "@/interfaces";
import DiagnosisForm from "./diagnosisForm";
import { Button } from "@mui/material";
import { MedicationsForm } from "./medication";  

     
export const StartConsultationFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();

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
          <LabRequestForm
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
            addRequest={function (value: LabRequest): void {
              throw new Error("Function not implemented.");
            }}
          />
          <LabOrderTable />
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
