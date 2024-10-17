"use client";
import { NewStepperContainer } from "@/components";
import { useNavigation } from "@/hooks";
import React, { useState } from "react";
import { AbdomenPelvisForm, ChestForm, ExtremitiesForm, GeneralInformation, HeadAndNeck } from ".";

export function SecondaryAssessmentFlow() {
  const [activeStep, setActiveStep] = useState<number>(4);
  const { navigateTo, navigateBack } = useNavigation();

  const steps = [
    { id: 1, label: "General Information" },
    { id: 2, label: "Head and Neck" },
    { id: 3, label: "Chest" },
    { id: 4, label: "Abdomen and Pelvis" },
    { id: 5, label: "Extremities" },
  ];

  const handleGeneralInformationSubmit = () => {
    setActiveStep(1);
  };

  const handleHeadAndNeckSubmit = ()=>{
    setActiveStep(2);
  }
  const handleChestSubmit = ()=>{
    setActiveStep(3);
  }
  const handleAbdomenSubmit = ()=>{
    setActiveStep(4);
  }
  const handleExtremitiesSubmit = ()=>{
    setActiveStep(1);
  }

  return (
    <NewStepperContainer
      setActive={setActiveStep}
      title="Secondary Assessment"
      steps={steps}
      active={activeStep}
      onBack={() => navigateBack()}
    >
      <GeneralInformation onSubmit={handleGeneralInformationSubmit} />
      <HeadAndNeck onSubmit={handleHeadAndNeckSubmit} />
      <ChestForm onSubmit={handleChestSubmit} />
      <AbdomenPelvisForm onSubmit={handleAbdomenSubmit} />
      <ExtremitiesForm onSubmit={handleExtremitiesSubmit} />
    </NewStepperContainer>
  );
}
