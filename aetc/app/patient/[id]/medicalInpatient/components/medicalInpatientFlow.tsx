"use client";

import { useEffect, useState } from "react";
import { NewStepperContainer } from "@/components";
import { PastMedicalHistory, PresentingComplaints } from ".";
import { useNavigation, useSubmitEncounter } from "@/hooks";
import { DrugList } from "./drugList";
import { PhysicalExamination } from "./physicalExamination";
import { DifferentialDiagnosis } from "./differentialDiagnosis";
import { ReviewOfSystems } from "./reviewOfSystems"; // <-- import your new form

import { encounters } from "@/constants";
import { Investigations } from "./investigations";

export const MedicalInPatientFlow = () => {
  const { navigateBack } = useNavigation();
  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.MEDICAL_IN_PATIENT,
    () => {
      // navigateBack()
    }
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  const [obs, setObs] = useState<any[]>([]);

  const steps = [
    {
      id: 1,
      label: "Presenting Complaints",
    },
    {
      id: 11,
      label: "Drug History",
    },
    {
      id: 2,
      label: "Past medical history",
    },
    {
      id: 23,
      label: "Physical Examination",
    },
    {
      id: 21,
      label: "Differential Diagnosis",
    },
    { id: 25, label: "Review of Systems" }, // <-- added here

    {
      id: 24,
      label: "Investigation Plan",
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      setActiveStep(5);
    }
  }, [isSuccess]);

  const handlePresentingComplaints = (values: any) => {
    setObs(values);
    setActiveStep(1);
  };
  const handleDrug = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(2);
  };
  const handlePastMedical = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(3);
  };
  const handleReview = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(4);
  };

  const handleDifferentialSubmit = (values: any) => {

    handleSubmit([...obs, ...values]);
  };
  const handleReviewOfSystems = (values: any) => {
    console.log({ obs });
    // handleSubmit([...obs, ...values]); // submitting here before investigations
    // If you want investigations after review, remove handleSubmit here
    setActiveStep(6);
  };

  const handleInvestigationSubmit = () => {
    //  navigateBack();
  };

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical In Patient"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <PresentingComplaints onSubmit={handlePresentingComplaints} />
        <DrugList onSubmit={handleDrug} />
        <PastMedicalHistory onSubmit={handlePastMedical} />
        <PhysicalExamination onSubmit={handleReview} />
        <DifferentialDiagnosis
          loading={isLoading}
          onSubmit={handleDifferentialSubmit}
        />
        <ReviewOfSystems
          onSubmit={handleReviewOfSystems}
          onSkip={() => setActiveStep(5)} // Allow skipping to Differential Diagnosis
        />
        <Investigations onClose={handleInvestigationSubmit} />
      </NewStepperContainer>
    </>
  );
};
