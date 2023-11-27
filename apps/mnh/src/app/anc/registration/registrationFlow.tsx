import React from 'react'
import { useState } from "react";
import { NewStepperContainer } from 'shared-ui/src';
import CurrentObsteric from './currentObsteric/components/CurrentObsteric';
import Gestation from './gestation/components/Gestation';
import MedicalHistory from './medicalHistory/components/MedicalHistory';
import { VitalsForm } from './vitals/components/VitalsForm';
import { DemographicsForm } from './demographics/components/DemographicsForm';

export const RegistrationFlow = () => {
      const [activeStep,setActiveStep] = useState<number>(0)

  const steps = [
    // { id: 1, label: "Vitals"},
    // { id: 2, label: "Demographics"},
    { id: 1, label: "Current Obstetric Information" },
    { id: 2, label: "Gestation" },
    { id: 3, label: "Medical History" },
  ];
  

  // const handleSubmitVitalsForm=()=>{
  //   setActiveStep(1)
  // }
  // const handleDemographics=()=>{
  //   setActiveStep(2)
  // }
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
      {/* <VitalsForm
        initialValues={vitalsInitialValues}
        onSubmit={handleSubmitVitalsForm}
      />
      <DemographicsForm
       initialValues={demographicsInitialValues}
       onSubmit={handleDemographics}
      /> */}
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

const demographicsInitialValues = {
  registrationNumber: "",
  firstName: "",
  lastName: "",
  age: "",
  currentDistrict: "",
  currentTraditionalAuthority: "",
  currentVillage: "",
  nextOfKinFirstName: "",
  nextOfKinLastname: "",
  landmark: "",
};
