import React from 'react'
import { useState } from "react";
import { NewStepperContainer } from 'shared-ui/src';
import CurrentObsteric from './currentObsteric/components/currentObsteric';
import Gestation from './gestation/components/gestation';
import MedicalHistory from './medicalHistory/components/medicalHistory';
import { VitalsForm } from './vitals/components/vitalsForm';
import { DemographicsForm } from './demographics/components/demographicsForm';
import AncMatrix from '../physical-examination/components/ancMatrix';
import BreastExam from '../physical-examination/components/breastExam';
import AbnominalExamination from '../physical-examination/components/abnominalExamination';
import VulvaInspection from '../physical-examination/components/vulvaInspection';

export const RegistrationFlow = () => {
      const [activeStep,setActiveStep] = useState<number>(0)

  const steps = [
    // { id: 1, label: "Vitals"},
    // { id: 1, label: "Current Obstetric Information" },

    { id: 1, label: "abnominal"},
    { id: 2, label: "vilva" },
    // { id: 3, label: "Gestation" },
    // { id: 4, label: "Medical History" },
  ];
  

  // const handleSubmitVitalsForm=()=>{
  //   setActiveStep(1)
  // }
  // const handleDemographics=()=>{
  //   setActiveStep(2)
  // }
  const handleSubmitAbnominal=()=>{
    setActiveStep(1);
  }
  const handleSubmitVulvaInspection=()=>{
    setActiveStep(1);
  }
  // const handleSubmitBreastExam =()=>{
  //   setActiveStep(1)
  // }
  // const handleSubmitCurrentObsteric =()=>{
  //   setActiveStep(2)
  // }
  // const handleSubmitGestation =()=>{
  //   setActiveStep(3)
  // }
  // const handleSubmitMedicalHistory =()=>{
  //   setActiveStep(4)
  // }
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
      {/* <AncMatrix
        initialValues={ancMatrixInitialValues}
        onSubmit={handleSubmitAncMatrix}
      /> */}
      <AbnominalExamination
       initialValues={abnominalInitialValues}
       onSubmit={handleSubmitAbnominal}
      />
      <VulvaInspection
       initialValues={vulvalInitialValues}
       onSubmit={handleSubmitVulvaInspection}
      />
      {/* <BreastExam
       initialValues={breastIniialValues}
       onSubmit={handleSubmitBreastExam}
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
      /> */}
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
