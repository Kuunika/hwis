"use client";
import { FormContainer } from "shared-ui/src";
import { PrimaryAssessmentFlow } from "./components";
import { PatientInfoTab } from "@/components";

export default function PrimaryAssessment() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <PrimaryAssessmentFlow />
      </FormContainer>
    </>
  );
}
