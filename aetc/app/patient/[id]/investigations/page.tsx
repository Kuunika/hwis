"use client";
import {
  BackButton,
  FormContainer,
  NextButton,
  PatientInfoTab,
} from "@/components";
import React from "react";
import { concepts } from "@/constants";
import { TestPlanAccordion } from "../consultation/components/testPlanAccordion";

import { useParameters } from "@/hooks";

export default function FinalDiagnosis() {
  const { params } = useParameters();
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <BackButton />

        <TestPlanAccordion />
        <NextButton
          size="medium"
          sx={{ fontSize: "12px", mr: "1px", mt: "1ch", float: "right" }}
          title={"Proceed to Final Diagnosis"}
          url={`/patient/${params.id}/final-diagnosis`}
        />
      </FormContainer>
    </>
  );
}
