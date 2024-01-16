"use client";
import { useState } from "react";
import {
  MainPaper,
  NewStepperContainer,
  StepperContainer,
  WrapperBox,
} from "shared-ui/src";
import {
  DemographicsForm,
  FinancingForm,
  ReferralForm,
  SocialHistoryForm,
} from "../components";
import { addPatient, useNavigation } from "@/hooks";
import { successDialog } from "@/helpers";

export const NewRegistrationFlow = () => {
  const { navigateTo } = useNavigation();
  return (
    <>
      <DemographicsForm onSubmit={() => {}} />
    </>
  );
};
