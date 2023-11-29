import React from 'react'
import { useState } from 'react';
import { NewStepperContainer } from 'shared-ui/src';
import AbnominalExamination from './components/abnominalExamination';
import AncMatrix from './components/ancMatrix';
import BreastExam from './components/breastExam';
import VulvaInspection from './components/vulvaInspection';
import { useNavigation } from '../hooks';


export const PhysicalExaminationFlow = () => {
  const { navigateTo } = useNavigation();
  const [activeStep,setActiveStep] = useState<number>(0)
  const steps = [
    { id: 1, label: "Anc Matrix"},
    { id: 2, label: "Breast Exam"},
    { id: 3, label: "Abnominal Exam"},
    { id: 4, label: "Vulava Inspection"},
  ];

  const handleSubmitAncMatrix=()=>{
    setActiveStep(1)
  };

  const handleSubmitBreastExam = () => {
    setActiveStep(2);
  };

    const handleSubmitAbnominal=()=>{
    setActiveStep(3)
  }

  const handleSubmitVulvaInspection = () => {
    setActiveStep(4);
  };

  
  return (
    <NewStepperContainer
      title="Physical Examination/Palpation"
      steps={steps}
      active={activeStep}
    >
      <AncMatrix
        initialValues={ancMatrixInitialValues}
        onSubmit={handleSubmitAncMatrix}
      />
      <BreastExam
        initialValues={breastIniialValues}
        onSubmit={handleSubmitBreastExam}
      />
      <AbnominalExamination
        initialValues={abnominalInitialValues}
        onSubmit={handleSubmitAbnominal}
      />
      <VulvaInspection
        initialValues={vulvalInitialValues}
        onSubmit={handleSubmitVulvaInspection}
      />
    </NewStepperContainer>
  );
}
const ancMatrixInitialValues = {
  pallorInfo: "",
  oedemaPresent: "",
  severityInfo: "",
  coughInfo: "",
  coughDuration: "",
  weightInfo: "",
  feverInfo: "",
  nightSweatsInfo: "",
};
const breastIniialValues = {
  breastExam: "",
  abnornalityInfo: "",
  otherInfo: "",
};
 const abnominalInitialValues = {
   scarInfo: "",
   fundalHeight: "",
   Foetallie: "",
   foetalPresentation: "",
   pregnancyTest: "",
   pregancyResult: "",
   fatalHeart: "",
 };
 const vulvalInitialValues = {
   vulvaInfo: "",
   otherInfo: "",
 };