"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { concepts } from "@/constants";
import { useNavigation } from "@/hooks";

import DiagnosisForm from "./diagnosisForm";
import { Box, Button } from "@mui/material";
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
          <Buttons onNext={() => setActiveStep(1)} />
        </>
        <>
          <TestAccordion />
          <Buttons
            onNext={() => setActiveStep(2)}
            onPrevious={() => setActiveStep(0)}
          />
        </>
        <>
          <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />
          {/* Final Diagnosis */}
          <Buttons
            onNext={() => setActiveStep(3)}
            onPrevious={() => setActiveStep(1)}
          />
        </>
        <MedicationsForm onSkip={() => {}} onSubmit={() => {}} />
      </NewStepperContainer>
    </>
  );
};

const Buttons = ({
  onPrevious,
  onNext,
}: {
  onNext?: () => void;
  onPrevious?: () => void;
}) => {
  return (
    <Box sx={{ mt: "1ch" }}>
      {onPrevious && (
        <Button
          sx={{ mr: "0.5ch" }}
          size="small"
          variant="contained"
          color="inherit"
          onClick={onPrevious}
        >
          Previous
        </Button>
      )}
      {onNext && (
        <Button size="small" variant="contained" onClick={onNext}>
          Next
        </Button>
      )}
    </Box>
  );
};
