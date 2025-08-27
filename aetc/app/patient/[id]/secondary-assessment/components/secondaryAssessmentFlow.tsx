"use client";
import { NewStepperContainer } from "@/components";
import { useNavigation, useParameters } from "@/hooks";
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
  const { navigateBackToProfile, navigateTo } = useNavigation();
  const { params } = useParameters();

  const steps = [
    {
      id: 1,
      label: "General Information",
      encounter: encounters.GENERAL_INFORMATION_ASSESSMENT,
    },
    {
      id: 2,
      label: "Head and Neck",
      encounter: encounters.HEAD_AND_NECK_ASSESSMENT,
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
  const redirectToDifferentialDiagnosis = () => {
    navigateTo(`/patient/${params.id}/differential-diagnosis`);
  };

  return (
    <NewStepperContainer
      setActive={setActiveStep}
      title="Secondary Survey"
      steps={steps}
      active={activeStep}
      onBack={() => navigateBackToProfile()}
      showSubmittedStatus
    >
      <GeneralInformation onSubmit={handleGeneralInformationSubmit} />
      <HeadAndNeck onSubmit={handleHeadAndNeckSubmit} />
      <ChestForm onSubmit={handleChestSubmit} />
      <AbdomenPelvisForm onSubmit={handleAbdomenSubmit} />
      <ExtremitiesForm onSubmit={handleExtremitiesSubmit} />
      <NeurologicalExamination onSubmit={redirectToDifferentialDiagnosis} />
    </NewStepperContainer>
  );
}
