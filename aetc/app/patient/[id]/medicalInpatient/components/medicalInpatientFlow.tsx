"use client";

import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { PastMedicalHistory, PresentingComplaints } from ".";
import { useNavigation, useSubmitEncounter } from "@/hooks";
import { DrugList } from "./drugList";
import { ReviewOfSystems } from "./reviewOfSystems";
import { DifferentialDiagnosis } from "./differentialDiagnosis";
import { encounters } from "@/constants";
import { Investigations } from "./investigations";


export const MedicalInPatientFlow = () => {
  const { navigateBack } = useNavigation();
  const { handleSubmit } = useSubmitEncounter(encounters.MEDICAL_IN_PATIENT, () => {
    // navigateBack()
  })
  const [activeStep, setActiveStep] = useState<number>(0);
  const [obs, setObs] = useState<any[]>([])

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
      label: "Review of Systems",

    },
    {
      id: 21,
      label: "Differential Diagnosis",
    },
    {
      id: 24,
      label: "Investigation Plan",
    },
  ];


  const handlePresentingComplaints = (values: any) => {
    setObs(values)
    setActiveStep(1)
  }
  const handleDrug = (values: any) => {
    setObs((obs) => ([...obs, ...values]))
    setActiveStep(2)
  }
  const handlePastMedical = (values: any) => {
    setObs((obs) => ([...obs, ...values]))
    setActiveStep(3)
  }
  const handleReview = (values: any) => {
    setObs((obs) => ([...obs, ...values]))
    setActiveStep(4);
  }

  const handleDifferentialSubmit = (values: any) => {
    handleSubmit([...obs, ...values])
    setActiveStep(5);
  }


  const handleInvestigationSubmit = () => {
   navigateBack();
  }

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
        <ReviewOfSystems onSubmit={handleReview} />
        <DifferentialDiagnosis onSubmit={handleDifferentialSubmit} />
        <Investigations onClose={handleInvestigationSubmit} />
      </NewStepperContainer>
    </>
  );
};
