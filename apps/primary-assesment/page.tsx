import React from 'react'
import { useState } from 'react';
import { MainCard, StepperContainer } from "shared-ui/src";

const page = () => {
    const [activeStep, setActiveStep] = useState<number>(0)
      const steps = [
        { id: 1, label: "Circulation Assessment" },
        { id: 2, label: "Exposure Assessment" },
        { id: 3, label: "Disability Assessment" },
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
        <h1>Primary Assesment</h1>
        <StepperContainer steps={steps} active={activeStep}>
        </StepperContainer>
      </MainCard>
    </>
  );
}

export default page