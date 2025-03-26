"use client";
import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { SecondaryAssessmentFlow } from "./";

export default function SecondaryAssessment() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <SecondaryAssessmentFlow />
      </FormContainer>
    </>
  );
}
