"use client";
import { DemographicsForm } from "@/components/forms";
import { MainCard, StepperContainer } from "shared-ui/src";

export default function Home() {
  const steps = [{ id: 1, label: "Demographics" }];

  return (
    <>
      <MainCard elevation={2} sx={{ mx: "2ch", my: "2ch" }}>
        <StepperContainer steps={steps} active={0}>
          <DemographicsForm onSubmit={() => console.log("log")} />
        </StepperContainer>
      </MainCard>
    </>
  );
}
