import { useState } from "react";
import { StepperContainer } from "shared-ui/src";
import {
  DemographicsForm,
  FinancingForm,
  ReferralForm,
  SocialHistoryForm,
} from ".";

export const RegistrationFlow = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const {} = useState([]);

  const steps = [
    { id: 1, label: "Demographics" },
    { id: 2, label: "Social History" },
    { id: 3, label: "Referral" },
    { id: 4, label: "Financing" },
  ];

  const handleSubmitDemographics = () => {
    setActiveStep(1);
  };
  const handleSubmitSocialHistory = () => {
    setActiveStep(2);
  };
  const handleSubmitReferral = () => {
    setActiveStep(3);
  };
  const handleSubmitFinancing = () => {};

  return (
    <StepperContainer
      steps={steps}
      active={activeStep}
      containerSx={{ display: "block" }}
      sx={{ alignItems: "flex-start" }}
    >
      <DemographicsForm
        initialValues={demographicsInitialValues}
        onSubmit={handleSubmitDemographics}
      />

      <SocialHistoryForm
        initialValues={socialHistoryInitialValues}
        onSubmit={handleSubmitSocialHistory}
      />
      <ReferralForm
        initialValues={referralInitialValues}
        onSubmit={handleSubmitReferral}
      />
      <FinancingForm
        initialValues={financingInitialValues}
        onSubmit={handleSubmitFinancing}
      />
    </StepperContainer>
  );
};

const demographicsInitialValues = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  currentDistrict: "",
  currentTraditionAuthority: "",
  currentVillage: "",
  closeLandMark: "",
  nextOfKinName: "",
  nextOfKinRelationship: "",
  nextOfKinPhoneNumber: "",
  id: "",
  homeDistrict: "",
  homeTraditionalAuthority: "",
  homeVillage: "",
  guardianName: "",
  guardianPhoneNumber: "",
};

const socialHistoryInitialValues = {
  maritalStatus: "",
  occupation: "",
  religion: "",
  highestEducation: "",
  methodOfTransportation: "",
};

const referralInitialValues = {
  refereeMedicalFacility: "",
};

const financingInitialValues = {
  insuranceProvider: "",
  insuranceIdNo: "",
  insuranceSchema: "",
};
