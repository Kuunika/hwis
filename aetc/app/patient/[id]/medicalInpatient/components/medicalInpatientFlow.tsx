"use client";

import { useEffect, useState } from "react";
import { NewStepperContainer } from "@/components";
// import { 
//   PastMedicalHistory, 
//   PresentingComplaints,
//   PastSurgicalHistory,
//   AllergyHistory,
//   IntoxicationHistory,
//   SocialHistory,
//   FamilyHistory
// } from ".";
import { PresentingComplaints } from "./presentingComplaints";
import { PastMedicalHistory } from "./pastMedicalHistory";
import { PastSurgicalHistory } from "./pastSurgicalHistory";
import { AllergyHistory } from "./allergyHistory";
import { IntoxicationHistory } from "./intoxicationHistory";
import { SocialHistory } from "./socialHistory";
import { FamilyHistory } from "./familyHistory";
import { useNavigation, useSubmitEncounter } from "@/hooks";
import { DrugList } from "./drugList";
import { PhysicalExamination } from "./physicalExamination";
import { DifferentialDiagnosis } from "./differentialDiagnosis";
import { ReviewOfSystems } from "./reviewOfSystems";

import { encounters } from "@/constants";
import { Investigations } from "./investigations";
import { useParameters } from "@/hooks";


export const MedicalInPatientFlow = () => {
  const { navigateBack } = useNavigation();
  const { navigateTo } = useNavigation();
  const { params } = useParameters();


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
      label: "Past Medical History",
    },
    {
      id: 3,
      label: "Past Surgical History",
    },
    {
      id: 4,
      label: "Allergy",
    },
    {
      id: 5,
      label: "Intoxication",
    },
    {
      id: 6,
      label: "Social History",
    },
    {
      id: 7,
      label: "Family History",
    },
    {
      id: 23,
      label: "Physical Examination",
    },
    {
      id: 21,
      label: "Differential Diagnosis",
    },
    {
      id: 25,
      label: "Review of Systems"
    },
    {
      id: 24,
      label: "Investigation",
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      setActiveStep(11);
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

  const handlePastSurgical = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(4);
  };

  const handleAllergy = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(5);
  };

  const handleIntoxication = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(6);
  };

  const handleSocialHistory = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(7);
  };

  const handleFamilyHistory = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(8);
  };

  const handlePhysicalExam = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(9);
  };

  const handleDifferentialSubmit = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(10);
  };

  // Modified to just collect Review of Systems data
  const handleReviewOfSystems = (values: any) => {
    setObs((obs) => [...obs, ...values]);
    setActiveStep(11);
  };

  // Final submission happens here after collecting Additional Notes
  const handleInvestigationSubmit = (values: any) => {
    const allObservations = [...obs, ...values];
    console.log("Submitting all observations including additional notes:", { allObservations });
    handleSubmit(allObservations);
    navigateTo(`/patient/${params.id}/profile`);

  };

  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Medical Inpatient Admission Sheet"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <PresentingComplaints onSubmit={handlePresentingComplaints} />
        <DrugList onSubmit={handleDrug} />
        <PastMedicalHistory onSubmit={handlePastMedical} />
        <PastSurgicalHistory onSubmit={handlePastSurgical} />
        <AllergyHistory onSubmit={handleAllergy} />
        <IntoxicationHistory onSubmit={handleIntoxication} />
        <SocialHistory onSubmit={handleSocialHistory} />
        <FamilyHistory onSubmit={handleFamilyHistory} />
        <PhysicalExamination onSubmit={handlePhysicalExam} />
        <DifferentialDiagnosis
          loading={isLoading}
          onSubmit={handleDifferentialSubmit}
        />
        <ReviewOfSystems
          onSubmit={handleReviewOfSystems}
          onSkip={() => setActiveStep(11)}
        />
        <Investigations onClose={handleInvestigationSubmit} />
      </NewStepperContainer>
    </>
  );
};