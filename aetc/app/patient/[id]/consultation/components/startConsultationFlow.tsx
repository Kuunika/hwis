"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { concepts } from "@/constants";
import { useNavigation } from "@/hooks";

import DiagnosisForm from "./diagnosisForm";
import { Button } from "@mui/material";
import { MedicationsForm } from "./medication";
import { TestAccordion } from "./testAccordion";
import { ConsultationContext, ConsultationContextType } from "@/contexts";

export const StartConsultationFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBack } = useNavigation();
  const { activeStep: step } = useContext(
    ConsultationContext
  ) as ConsultationContextType;

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = [
    { id: 12, label: "Differential Diagnosis" }, // Step for Differential Diagnosis
    { id: 1, label: "Investigations" },
    { id: 13, label: "Final Diagnosis" }, // Step for Final Diagnosis
    { id: 14, label: "Medication" },
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
          <DiagnosisForm conceptType={concepts.DIFFERENTIAL_DIAGNOSIS} />
          {/* Differential Diagnosis */}
          <Button variant="contained" onClick={() => setActiveStep(1)}>
            Next
          </Button>
        </>
        <>
          <TestAccordion />
          <Button onClick={() => setActiveStep(2)}>Next</Button>
        </>
        <>
          <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />
          {/* Final Diagnosis */}
          <Button onClick={() => setActiveStep(3)}>Next</Button>
        </>
        <MedicationsForm onSkip={() => {}} onSubmit={() => {}} />
      </NewStepperContainer>
    </>
  );
};
