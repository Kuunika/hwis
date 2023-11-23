"use client"
import { NewStepperContainer } from 'shared-ui/src';
import CurrentObsteric from './anc/registration/currentObsteric/components/CurrentObsteric'
import MedicalHistory from './anc/registration/medicalHistory/components/MedicalHistory'
import { useState } from 'react';
import Gestation from './anc/registration/gestation/components/Gestation';

export default function Home() {
  const [activeStep,setActiveStep] = useState<number>(0)

  const steps = [
    { id: 1, label: "Current Obstetric Information" },
    { id: 2, label: "Gestation" },
    { id: 3, label: "Medical History" },
  ];
  
  const handleSubmitCurrentObsteric =()=>{
    setActiveStep(1)
  }
  const handleSubmitGestation =()=>{
    setActiveStep(2)
  }
  const handleSubmitMedicalHistory =()=>{
    setActiveStep(3)
  }

  return (
    <NewStepperContainer title="Registration" steps={steps} active={activeStep}>
      <CurrentObsteric
        initialValues={currentObstericInitialValues}
        onSubmit={handleSubmitCurrentObsteric}
      />
      <Gestation
        initialValues={gestationInitialValues}
        onSubmit={handleSubmitGestation}
      />
      <MedicalHistory
        initialValues={medicalHistoryInitialValues}
        onSubmit={handleSubmitMedicalHistory}
      />
    </NewStepperContainer>
  );
};

const currentObstericInitialValues = {
  pregnancyTest: "",
  lmpInfo: "",
  eddInfo: "",
};
const gestationInitialValues = {
  weekOfVisit: "",
  pregnancyTest: "",
  weightInfo: "",
  heightInfo: "",
  pulseRate: "",
  bloodPressure: "",
  preEclampsia: "",
  generalCondition: "",
};
  const medicalHistoryInitialValues = {
    asthmaInfo: "",
    hypertensionInfo: "",
    diabetesInfo: "",
    renalDisease: "",
    fistulaRepair: "",
    LegSpineDeformity: "",
    hivStatus: "",
    artInfo: "",
    startArt: "",
    artRegistration: "",
  };
