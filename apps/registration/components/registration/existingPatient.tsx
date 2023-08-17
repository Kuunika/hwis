"use client";
import { useState, FC } from "react";
import { MedicalInsuranceForm, SocialHistory } from "@/components/forms";
import { MainCard, StepperContainer } from "shared-ui/src";

type Prop = {
  title: string;
};
export const ExistingRegistration: FC<Prop> = ({ title }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 3, label: "Referral" },
    { id: 4, label: "Insurance" },
  ];

  return (
    <>
      <MainCard
        elevation={2}
        sx={{
          mx: "2ch",
          my: "2ch",
          alignItems: "center",
        }}
      >
        <h1>{title}</h1>
        <StepperContainer steps={steps} active={activeStep}>
          <SocialHistory onSubmit={() => setActiveStep(1)} />
          <MedicalInsuranceForm onSubmit={() => setActiveStep(0)} />
        </StepperContainer>
      </MainCard>
    </>
  );
};
