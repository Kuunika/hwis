"use client";

import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { PastMedicalHistory, PresentingComplaints } from ".";
import { useNavigation } from "@/hooks";
import { DrugList } from "./drugList";
import { ReviewOfSystems } from "./reviewOfSystems";
import { DifferentialDiagnosis } from "./differentialDiagnosis";


export const MedicalInPatientFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { navigateBack } = useNavigation();

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
  ];

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical In Patient"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <PresentingComplaints onSubmit={() => setActiveStep(1)} />
        <DrugList onSubmit={() => setActiveStep(2)} />
        <PastMedicalHistory onSubmit={() => setActiveStep(3)} />
        <ReviewOfSystems onSubmit={() => setActiveStep(4)} />
        <DifferentialDiagnosis onSubmit={()=>navigateBack()} />
      </NewStepperContainer>
    </>
  );
};
