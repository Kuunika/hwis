import React from 'react'
import { useState } from "react";
import { MainButton, NewStepperContainer, WrapperBox } from 'shared-ui/src';
import CurrentObsteric from './currentObsteric/components/currentObsteric';
import Gestation from './gestation/components/gestation';
import MedicalHistory from './medicalHistory/components/medicalHistory';
import { VitalsForm } from './vitals/components/vitalsForm';
import { DemographicsForm } from './demographics/components/demographicsForm';
import { useNavigation } from '../hooks';


export const RegistrationFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const { navigateTo } = useNavigation();

  const steps = [
    { id: 1, label: "Vitals" },
    { id: 2, label: "Demographics" },
    { id: 3, label: "Current Obstetric Information" },
    { id: 4, label: "Gestation" },
    { id: 5, label: "Medical History" },
  ];


  const handleSubmitVitalsForm = () => {
    setActiveStep(1)
  }
  const handleDemographics = () => {
    setActiveStep(2)
  }
  const handleSubmitCurrentObsteric = () => {
    setActiveStep(3)
  }
  const handleSubmitGestation = () => {
    setActiveStep(4)
  }
  const handleSubmitMedicalHistory = () => {
    navigateTo("/anc/physical-examination");
  }
  return (
    <NewStepperContainer title="Registration" steps={steps} active={activeStep}>
      <VitalsForm
        initialValues={vitalsInitialValues}
        onSubmit={handleSubmitVitalsForm}
      />
      <DemographicsForm
        initialValues={demographicsInitialValues}
        onSubmit={handleDemographics}
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



