import { useState } from "react";
import { NewStepperContainer, StepperContainer } from "shared-ui/src";
import {
  DemographicsForm,
  FinancingForm,
  ReferralForm,
  SocialHistoryForm,
} from ".";
import { addPatient, useNavigation } from "@/hooks";
import { successDialog } from "@/helpers";

export const RegistrationFlow = () => {
  const { navigateTo } = useNavigation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addPatient();

  const steps = [
    { id: 1, label: "Demographics" },
    { id: 2, label: "Social History" },
    { id: 3, label: "Referral" },
    // { id: 4, label: "Financing" },
  ];

  const handleSubmitDemographics = (data: any) => {
    mutate(data);
    setActiveStep(1);
  };
  const handleSubmitSocialHistory = () => {
    setActiveStep(2);
  };
  const handleSubmitReferral = () => {
    successDialog({
      title: "Registration Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/registration/list"),
      confirmButtonText: "Register More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
    // setActiveStep(3);
  };
  const handleSubmitFinancing = () => {
    successDialog({
      title: "Registration Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/registration/list"),
      confirmButtonText: "Register More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
  };

  return (
    <NewStepperContainer
      title="Registration"
      steps={steps}
      active={activeStep}
      setActive={(value) => {
        setActiveStep(value);
      }}
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
    </NewStepperContainer>
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
  identificationNumber: "",
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
