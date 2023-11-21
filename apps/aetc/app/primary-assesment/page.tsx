"use client"
import React from "react";
import { useState } from "react";
import { MainCard, StepperContainer } from "shared-ui/src";
import Circulation from "./componennts/Circulation";
import Disability from "./componennts/Disability";
import Exposure from "./componennts/Exposure";


const page = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    // { id: 1, label: "Circulation Assessment" },
    { id: 1, label: "Disability Assessment" },
    { id: 2, label: "Exposure Assessment" },
   
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
          {/* <Circulation onSubmit={() => setActiveStep(1)} /> */}
          <Disability onSubmit={()=> setActiveStep(1)}/>
          <Exposure onSubmit={()=>setActiveStep(2)}/>
        </StepperContainer>
      </MainCard>
    </>
  );
};

export default page;
