import React from 'react'
import { useState } from "react";
import { NewStepperContainer } from 'shared-ui/src';
import CurrentObsteric from './currentObsteric/components/CurrentObsteric';
import Gestation from './gestation/components/Gestation';
import MedicalHistory from './medicalHistory/components/MedicalHistory';
import { VitalsForm } from './vitals/components/VitalsForm';

export const RegistrationFlow = () => {
      const [activeStep,setActiveStep] = useState<number>(0)

  const steps = [
    { id: 1, label: "Vitals"},
    { id: 2, label: "Current Obstetric Information" },
    { id: 3, label: "Gestation" },
    { id: 4, label: "Medical History" },
  ];
  
  const handleSubmitVitalsForm=()=>{
    setActiveStep(1)
  }
  const handleSubmitCurrentObsteric =()=>{
    setActiveStep(2)
  }
  const handleSubmitGestation =()=>{
    setActiveStep(3)
  }
  const handleSubmitMedicalHistory =()=>{
    setActiveStep(4)
  }
  return (
    <NewStepperContainer title="Registration" steps={steps} active={activeStep}>
      <VitalsForm
        initialValues={vitalsInitialValues}
        onSubmit={handleSubmitVitalsForm}
      />
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
}

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

const vitalsInitialValues = {
  bloodPressure: "",
  weight: "",
  height: "",
  temperature: "",
  gait: "",
};
