"use client";

import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import GeneralDetailsForm from "./generalDetails";
import PregnancyHistoryForm from "./historyDetails";
import PregnancyAdditionalHistoryForm from "./gynaeHistory";
import ExamForm from "./examination";

import { useNavigation, useParameters } from "@/hooks";

export const GynaeWorkflow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  //persist all form values here
  const [formData, setFormData] = useState<any>({});
  const { navigateBackToProfile, navigateTo } = useNavigation();
  const { params } = useParameters();

  // Steps definition
  const steps = [
    { id: 1, label: "General Details" },
    { id: 2, label: "Pregnancy History" },
    { id: 3, label: "Additional Gynae History" },
    { id: 4, label: "examination form" },
  ];

  // Step 1 submit
  const handleGeneralDetailsSubmit = (values: any) => {
    console.log("General Details:", values);
    setActiveStep(1);
  };

  // Step 2 submit
  const handleHistorySubmit = (values: any) => {
    console.log("Pregnancy History:", values);
    setActiveStep(2);
  };

  // Step 3 submit
  const handleAdditionalHistorySubmit = (values: any) => {
    console.log("Additional Gynae History:", values);
    setActiveStep(3);
  };

  // Step 4 submit
  const handleExaminationForm = (values: any) => {
    console.log("Examination Details:", values);

    // Navigate to summary after final step
    navigateTo(`/patient/${params.id}/summary`);
  };


//   const handleFormSubmission = (stepValues: any, nextStep?: number) => {
//   setFormData((prev: any) => ({ ...prev, ...stepValues }));
//   if (nextStep !== undefined) setActiveStep(nextStep);
// };

//   // Final step: redirect after persisting
//   const handleFinalSubmission = (values: any) => {
//     const updatedData = { ...formData, ...values };
//     console.log(" Final Submission Data:", updatedData);

//     navigateTo(`/patient/${params.id}/summary`);
//   };

  return (
    <NewStepperContainer
      setActive={setActiveStep}
      title="pregnancy form"
      steps={steps}
      active={activeStep}
      onBack={() => navigateBackToProfile()}
      showSubmittedStatus
    >
       <GeneralDetailsForm onSubmit={handleGeneralDetailsSubmit} />
      <PregnancyHistoryForm onSubmit={handleHistorySubmit} />
      <PregnancyAdditionalHistoryForm
        onSubmit={handleAdditionalHistorySubmit}
      />
      <ExamForm onSubmit={handleExaminationForm} />


      {/* {activeStep === 0 && (
        <GeneralDetailsForm 
        onSubmit={ ( values) => handleFormSubmission(values,1)}
        initialValues={formData} />
      )}
      {activeStep === 1 && (
        <PregnancyHistoryForm 
        onSubmit={ ( values) => handleFormSubmission(values,2)}
        initialValues={formData} />
      )}
      {activeStep === 2 && (
        <PregnancyAdditionalHistoryForm
          onSubmit = { ( values) => handleFormSubmission(values,3)}
          initialValues={formData}
        />
      )}

      {activeStep === 3 && (
        <ExamForm
          onSubmit={handleFinalSubmission}
          initialValues={formData}
        />  
      )} */}
    </NewStepperContainer>
  );
};

export default GynaeWorkflow;
