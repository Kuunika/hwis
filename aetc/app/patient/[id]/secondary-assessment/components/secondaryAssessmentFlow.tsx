"use client";
import { NewStepperContainer } from "@/components";
import { useNavigation } from "@/hooks";
import React, { useState } from "react";
import {
  AbdomenPelvisForm,
  ChestForm,
  ExtremitiesForm,
  GeneralInformation,
  HeadAndNeck,
  NeurologicalExamination,
} from ".";
import { encounters } from "@/constants";

export function SecondaryAssessmentFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBack } = useNavigation();

  const steps = [
    {
      id: 1,
      label: "General Information",
      encounter: encounters.GENERAL_INFORMATION_ASSESSMENT,
    },
    {
      id: 2,
      label: "Head and Neck",
      encounters: encounters.HEAD_AND_NECK_ASSESSMENT,
    },
    { id: 3, label: "Chest", encounter: encounters.CHEST_ASSESSMENT },
    {
      id: 4,
      label: "Abdomen and Pelvis",
      encounter: encounters.ABDOMEN_AND_PELVIS_ASSESSMENT,
    },
    {
      id: 5,
      label: "Extremities",
      encounter: encounters.EXTREMITIES_ASSESSMENT,
    },
    {
      id: 52,
      label: "Neurological Examination",
      encounter: encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT,
    },
  ];

  const handleGeneralInformationSubmit = () => {
    setActiveStep(1);
  };

  const handleHeadAndNeckSubmit = () => {
    setActiveStep(2);
  };
  const handleChestSubmit = () => {
    setActiveStep(3);
  };
  const handleAbdomenSubmit = () => {
    setActiveStep(4);
  };
  const handleExtremitiesSubmit = () => {
    setActiveStep(5);
  };

  return (
    <NewStepperContainer
      setActive={setActiveStep}
      title="Secondary Assessment"
      steps={steps}
      active={activeStep}
      onBack={() => navigateBack()}
      showSubmittedStatus
    >
      <GeneralInformation onSubmit={handleGeneralInformationSubmit} />
      <HeadAndNeck onSubmit={handleHeadAndNeckSubmit} />
      <ChestForm onSubmit={handleChestSubmit} />
      <AbdomenPelvisForm onSubmit={handleAbdomenSubmit} />
      <ExtremitiesForm onSubmit={handleExtremitiesSubmit} />
      <NeurologicalExamination onSubmit={navigateBack} />
    </NewStepperContainer>
  );
}
