"use client";
import { useState } from "react";
import {
  DemographicsForm,
  MedicalInsuranceForm,
  ReferralForm,
  SocialHistory,
} from "@/components/forms";
import { MainCard, StepperContainer } from "shared-ui/src";

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 1, label: "Demographics" },
    { id: 2, label: "Social History" },
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
        <h1>New Patient Registration</h1>
        <StepperContainer steps={steps} active={activeStep}>
          <DemographicsForm onSubmit={() => setActiveStep(1)} />
          <SocialHistory onSubmit={() => setActiveStep(2)} />
          <ReferralForm onSubmit={() => setActiveStep(3)} />
          <MedicalInsuranceForm onSubmit={() => setActiveStep(0)} />
        </StepperContainer>
      </MainCard>
    </>
  );
}
