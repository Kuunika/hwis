"use client";
import { useState } from "react";
import { StepperContainer, WrapperBox } from "shared-ui/src";
import { Form } from "./components";

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    { id: 1, label: "Create Form" },
    { id: 2, label: "Create Sections" },
    { id: 3, label: "Configure Sections" },
  ];

  const handleFormCreate = (values: any) => {
    console.log({ values });
  };

  return (
    <WrapperBox mt={10}>
      <StepperContainer active={activeStep} steps={steps}>
        <Form onSubmit={handleFormCreate} />
        <></>
      </StepperContainer>
    </WrapperBox>
  );
}
