"use client";
import { useState } from "react";
import Form_DATA from "../../test";
import { MainCard, MainTypography, StepperContainer } from "shared-ui/src";
import { FormFragment } from ".";

export const FormStepper = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const fragments = Form_DATA[0].fragments;
  const steps = Form_DATA[0].fragments.map((fd, index) => ({
    id: index + 1,
    label: fd.fragmentName,
  }));

  const handleSubmit = (values: any) => {};

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
        <MainTypography variant="h4">{Form_DATA[0].name}</MainTypography>
        <StepperContainer steps={steps} active={activeStep}>
          {fragments.map((fg, index) => (
            <FormFragment
              key={fg.id}
              frag={fg}
              onSubmit={(values: any) => {
                handleSubmit(values);
                setActiveStep(index + 1);
              }}
            />
          ))}
        </StepperContainer>
      </MainCard>
    </>
  );
};
